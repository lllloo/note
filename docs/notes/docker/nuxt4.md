# Nuxt 4 Dockerfile

這篇筆記整理 Nuxt 4 在 Docker 的常見容器化寫法，分成「開發環境」與「部署環境」兩種情境：

- 開發環境：以 `Dockerfile.dev` 搭配 BretFisher 的雙層目錄策略，將 `node_modules` 與原始碼分離
- 部署環境：使用多階段建置，只保留 Nuxt build 產物（`.output`），並以非 root 使用者執行

[[toc]]

## node:slim vs node:alpine

BretFisher 建議使用 `node:slim` 而非 `node:alpine`：

- Alpine 使用 musl libc，並非 Node.js 官方支援的 libc
- 含原生模組的套件（如 `sharp`、`bcrypt`）在 Alpine 上可能編譯失敗或行為異常
- slim 使用 Debian，是 Node.js 官方支援的環境

> 若確定專案沒有原生模組依賴，使用 `node:alpine` 也可以，映像更小。

## 開發環境

### 目錄結構策略

BretFisher 將 `node_modules` 與 source code **分層放置**，解決 bind mount 的跨平台衝突問題：

```text
/opt/node_app/
├── node_modules/   ← npm ci 安裝於此（上層，不會被 bind mount 覆蓋）
├── package.json
├── package-lock.json
└── app/            ← source code bind mount 至此（只掛子目錄）
    └── （你的 .vue、nuxt.config.ts 等）
```

這比「匿名 volume 覆蓋」更乾淨：bind mount 只掛 `app/` 子目錄，自然不會碰到上層的 `node_modules`。

### Dockerfile.dev

```dockerfile
FROM node:22-slim

# USER 要在 WORKDIR 之前，確保目錄以正確權限建立
# node:slim 內建 node 使用者，不需手動建立
USER node

# node_modules 安裝在此，與 source code 分離
WORKDIR /opt/node_app

COPY --chown=node:node package*.json ./

# node 使用者的 npm cache 在 /home/node/.npm
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm ci

# 讓 node_modules/.bin 的指令可直接使用
ENV PATH=/opt/node_app/node_modules/.bin:$PATH

# source code 放子目錄
WORKDIR /opt/node_app/app

COPY --chown=node:node . .

EXPOSE 3000 9229

CMD ["nuxt", "dev", "--host"]
```

> - `uid=1000,gid=1000`：cache mount 指定 node 使用者的 uid/gid，確保權限正確
> - `ENV PATH`：`node_modules` 不在 `app/` 下，需手動加入 PATH 才能執行 `nuxt` 等指令
> - `EXPOSE 9229`：Node.js inspector debug port，搭配 VSCode remote debug 使用

### compose.dev.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/opt/node_app/app
      - ./package.json:/opt/node_app/package.json
      - ./package-lock.json:/opt/node_app/package-lock.json
      - node_modules:/opt/node_app/app/node_modules
    ports:
      - '3000:3000'
      - '9229:9229'
    environment:
      - NODE_ENV=development

volumes:
  node_modules:
```

#### Volume 掛載說明

| volume | 用途 |
| --- | --- |
| `.:/opt/node_app/app` | source code bind mount，檔案異動即時反映（熱更新） |
| `./package.json:/opt/node_app/package.json` | 上層的 package.json 同步更新 |
| `./package-lock.json:/opt/node_app/package-lock.json` | 上層的 lock file 同步更新 |
| `node_modules:/opt/node_app/app/node_modules` | named volume 佔位，防止本機的 `node_modules` 被掛入 app/ |

`node_modules` named volume 的用途是佔住 `/opt/node_app/app/node_modules`，避免 `.:/opt/node_app/app` 的 bind mount 把本機的 `node_modules` 帶進來。容器實際使用的是安裝在 `/opt/node_app/node_modules/` 的那份（上層目錄，完全不受 bind mount 影響）。

同時這樣做也能避免 Node.js 的模組解析順序誤用到 `app/node_modules`：把它「佔住」之後，確保容器環境不會混入本機依賴，解析時會穩定使用上層的 `/opt/node_app/node_modules/`。

## 部署環境

### healthcheck.js

BretFisher 建議用獨立的 `healthcheck.js`，而非在 Dockerfile 內寫 inline shell：

- slim image 不一定有 `curl`，用 Node.js 原生 `http` 模組更可靠
- 邏輯獨立，方便維護與測試

```js
const http = require('http')

const options = {
  timeout: 2000,
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/healthz',
}

const request = http.request(options, (res) => {
  process.exitCode = res.statusCode === 200 ? 0 : 1
  process.exit()
})

request.on('error', () => process.exit(1))
request.end()
```

> Nuxt 4 需自行實作 `/api/healthz` 路由（server route），回傳 HTTP 200 即可。

### Dockerfile（多階段構建）

::: tip 提醒
本文 Dockerfile 使用 `RUN --mount=type=cache ...`（BuildKit 功能）加速安裝依賴。若你在 CI 或舊環境遇到語法不支援，請先啟用 Docker BuildKit。
:::

```dockerfile
# Stage 1: 建構應用程式
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npx nuxt build

# Stage 2: 執行環境
FROM node:22-slim AS runner

# USER 要在 WORKDIR 之前，確保目錄以正確權限建立
USER node

WORKDIR /opt/node_app

COPY --from=build --chown=node:node /app/.output ./.output
COPY --chown=node:node healthcheck.js .

EXPOSE 3000

HEALTHCHECK --interval=30s CMD node healthcheck.js

CMD ["node", ".output/server/index.mjs"]
```

#### 各 Stage 說明

| Stage | 用途 |
| --- | --- |
| `build` | 安裝所有套件並執行 `nuxt build` |
| `runner` | 最終映像，只複製 `.output`，不含原始碼與 devDependencies |

> - `USER node`：使用 image 內建的非 root 使用者，不需手動建立，且放在 `WORKDIR` 之前讓目錄以正確權限建立
> - `--mount=type=cache,target=/root/.npm`：BuildKit cache mount，npm 下載的套件快取在 Docker 管理的空間，重複建構時不用重新下載，且不會寫入 image layer
> - `CMD ["node", ".output/server/index.mjs"]`：直接用 `node` 執行而非 `npm start`，確保 `docker stop` 發出的 SIGTERM 能正確傳給 Node.js process 做 graceful shutdown（npm 不會轉發 signal）
> - 最終映像不含原始碼與開發套件，大幅縮小映像大小

#### `.output` 產物驗證（避免部署時缺 runtime 依賴）

多數情境下 Nuxt build 產物 `.output` 可以直接用 `node .output/server/index.mjs` 啟動，但仍建議你在自己的專案做一次驗證：

- 容器啟動是否成功
- 若啟動錯誤提到找不到模組（`Cannot find module ...`），代表 build 產物非完全自包含，需要調整 Nitro preset 設定

### compose.prod.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
```

## .dockerignore

原則是**只排除真正必要的項目**，避免過度設定。

```text
node_modules/
.nuxt/
.output/
.git/
.env*
.npmrc
```

| 項目 | 原因 |
| --- | --- |
| `node_modules/` | 容器內會重新安裝，排除可大幅縮小 build context |
| `.nuxt/` `.output/` | build 產物，容器內會重新建構 |
| `.git/` | 不需要版本控制歷史，減少 build context 大小 |
| `.env*` | 避免環境變數（含敏感資訊）被複製進 image |
| `.npmrc` | 可能含有私有 registry token，避免洩漏至 image |

## 常用指令

```bash
# 開發（背景執行）
docker compose -f compose.dev.yml up --build -d

# 部署（建構並啟動）
docker compose -f compose.prod.yml up --build -d

# 停止
docker compose -f compose.dev.yml down
docker compose -f compose.prod.yml down

# 查看日誌
docker compose -f compose.dev.yml logs -f app
docker compose -f compose.prod.yml logs -f app
```

## 參考資料

- [Docker 官方 Vue.js 容器化指南](https://docs.docker.com/guides/vuejs/)
- [BretFisher/node-docker-good-defaults](https://github.com/BretFisher/node-docker-good-defaults)
- [Nuxt 官方部署文件](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Nuxt Runtime Config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config)
- [10 best practices to containerize Node.js with Docker - Snyk](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
