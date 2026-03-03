# Nuxt 4 Dockerfile

這篇筆記整理 Nuxt 4 在 Docker 的容器化寫法，開發與部署共用同一份 `Dockerfile`，透過多階段建置區分情境。

[[toc]]

## node:slim vs node:alpine

建議使用 `node:slim` 而非 `node:alpine`：

- Alpine 使用 musl libc，並非 Node.js 官方支援的 libc
- 含原生模組的套件（如 `sharp`、`bcrypt`）在 Alpine 上可能編譯失敗或行為異常
- slim 使用 Debian，是 Node.js 官方支援的環境

> 若確定專案沒有原生模組依賴，使用 `node:alpine` 也可以，映像更小。

## Dockerfile

```dockerfile
# Stage 1: 安裝依賴
FROM node:24-slim AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2: 開發環境
FROM base AS dev

EXPOSE 3000

CMD ["npx", "nuxt", "dev", "--host", "0.0.0.0"]

# Stage 3: 建構應用程式
FROM base AS build

COPY . .

RUN npx nuxt build

# Stage 4: 執行環境（部署使用此 stage）
FROM node:24-slim AS prod

USER node

WORKDIR /opt/node_app

COPY --from=build --chown=node:node /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### 各 Stage 說明

| Stage   | 用途                                                     |
| ------- | -------------------------------------------------------- |
| `base`  | 安裝依賴，供後續 stage 繼承                              |
| `dev`   | 繼承 `base`，source code 由 volume 掛入，開發環境使用    |
| `build` | 繼承 `base`，複製 source code 並執行 `nuxt build`        |
| `prod`  | 最終映像，只複製 `.output`，不含原始碼與 devDependencies |

> - `base` 只安裝依賴不複製 source code，`package.json` 未變動時不重新執行 `npm ci`
> - `dev` stage 不 `COPY . .`，source code 完全由 compose volume 掛入，避免建構時複製無用的檔案
> - `prod` stage 使用 `USER node`：`node:slim` 內建 `node` 使用者，`USER node` 放在 `WORKDIR` 之前，確保目錄由 `node` 使用者建立，具備正確權限
> - `CMD ["node", ".output/server/index.mjs"]`：直接用 `node` 執行，確保 `docker stop` 的 SIGTERM 能正確傳給 Node.js 做 graceful shutdown（`npm start` 不轉發 signal）

## 開發環境

### compose.dev.yml

```yaml
services:
  app:
    build:
      context: .
      target: dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
```

`build.target: dev` 只建構到 `dev` stage，搭配 volume 掛載讓原始碼異動即時反映（熱更新）。

`/app/node_modules` 匿名 volume 用於佔位，避免 `.:/app` 的 bind mount 把本機的 `node_modules` 帶進來，確保使用容器內 `npm ci` 安裝的版本。

## 部署環境

### compose.prod.yml

```yaml
services:
  app:
    build:
      context: .
      target: prod
    ports:
      - '3000:3000'
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

`build.target: prod` 建構完整的多階段流程，最終映像只含 `.output`，不包含原始碼與開發套件。

> 若啟動錯誤提到找不到模組（`Cannot find module ...`），代表 build 產物非完全自包含，需要在 `nuxt.config.ts` 確認 `nitro.preset` 設為 `node-server`（預設值），或檢查是否誤用了其他 preset。

## .dockerignore

```text
node_modules/
.nuxt/
.output/
.git/
.env*
.npmrc
```

| 項目                | 原因                                           |
| ------------------- | ---------------------------------------------- |
| `node_modules/`     | 容器內會重新安裝，排除可大幅縮小 build context |
| `.nuxt/` `.output/` | build 產物，容器內會重新建構                   |
| `.git/`             | 不需要版本控制歷史，減少 build context 大小    |
| `.env*`             | 避免環境變數（含敏感資訊）被複製進 image       |
| `.npmrc`            | 可能含有私有 registry token，避免洩漏至 image  |

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

- [Docker 官方 Node.js 容器化指南](https://docs.docker.com/guides/nodejs/)
- [Nitro 部署文件](https://nitro.build/deploy/node)
