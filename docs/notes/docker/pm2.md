# Docker 不需要 PM2

在容器化環境中，PM2 的功能幾乎都可以由 Docker 原生機制取代，在容器內使用 PM2 反而會帶來額外問題。

[[toc]]

## PM2 在 Docker 的問題

PM2 在容器內是反模式（anti-pattern）：

- PM2 作為 PID 1 運行，Node.js 是 PM2 的子程序，`docker stop` 發出的 SIGTERM 由 PM2 接收，不一定正確轉發給 Node.js，導致 graceful shutdown 失效
- 容器本身就是隔離單元，Docker / Kubernetes 已負責程序監控與重啟，PM2 是多餘的一層
- 增加 image 大小與啟動複雜度

## Docker 取代 PM2 的方案

### crash 後重啟 → `restart` 政策

```yaml
services:
  app:
    restart: unless-stopped  # 容器 exit 時自動重啟
```

| 值 | 行為 |
| --- | --- |
| `no` | 不自動重啟（預設） |
| `always` | 永遠重啟，包含手動 stop 後再 daemon 啟動 |
| `unless-stopped` | 除非手動 stop，否則永遠重啟 |
| `on-failure` | 只在非正常結束時重啟（exit code 非 0） |

### 健康監控 → `HEALTHCHECK`

`restart` 只處理容器 **exit**（crash）。若 Node.js process 內部卡住（記憶體洩漏、event loop 卡死）而沒有 exit，`restart` 不會觸發，需要 `HEALTHCHECK` 偵測：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD node healthcheck.js
```

`healthcheck.js` 用 Node.js 原生 `http` 模組打健康檢查端點（slim image 不一定有 curl）：

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

> `HEALTHCHECK` 只負責回報狀態，在 Docker Swarm / Kubernetes 中，unhealthy 的容器會被自動替換。單純 `docker compose` 環境中，需搭配 `autoheal` 等工具才能自動重啟 unhealthy 容器。

### 多核心 cluster → 多副本或 Nitro preset

PM2 cluster 模式讓單台機器跑多個 Node.js worker 充分利用多核心，在 Docker 中有兩種替代方案：

#### 方案一：多個容器副本（推薦）

```bash
# docker compose 用 --scale
docker compose up --scale app=4
```

```yaml
# Docker Swarm / Kubernetes 用 deploy.replicas
services:
  app:
    deploy:
      replicas: 4
```

> `deploy.replicas` 只在 Docker Swarm 或 Kubernetes 生效，一般 `docker compose` 環境請用 `--scale`。

符合容器化設計，每個副本獨立，可獨立擴縮。

#### 方案二：Nitro 內建 cluster preset

Nuxt 4 / Nitro 支援內建多 worker，不需要 PM2：

```yaml
environment:
  - NITRO_PRESET=node_cluster
```

### 記憶體上限 → Docker 資源限制

```yaml
services:
  app:
    mem_limit: 512m
    restart: on-failure
```

搭配 Node.js `--max-old-space-size` 避免 OOM kill：

```dockerfile
CMD ["node", "--max-old-space-size=450", ".output/server/index.mjs"]
```

> V8 的記憶體上限設略低於 Docker 的 `mem_limit`，讓 Node.js 有機會觸發 GC 而非被 Docker 強制 kill。

## 功能對照表

| PM2 功能 | Docker 替代方案 |
| --- | --- |
| crash 後重啟 | `restart: unless-stopped` |
| 健康監控 | `HEALTHCHECK` + `healthcheck.js` |
| 多核心 cluster | 多容器副本 / `NITRO_PRESET=node_cluster` |
| 記憶體上限重啟 | `mem_limit` + `restart: on-failure` |
| 日誌管理 | `docker compose logs` / 集中式日誌服務 |

## 參考資料

- [From PM2 to Docker: Cluster Mode - Maxim Orlov](https://maximorlov.com/from-pm2-to-docker-cluster-mode/)
- [To PM2, or Not to PM2: Embracing Docker for Node.js - Medium](https://medium.com/@saderi/to-pm2-or-not-to-pm2-embracing-docker-for-node-js-b4a8adce141c)
- [Top 4 Tactics To Keep Node.js Rockin' in Docker - Docker Blog](https://www.docker.com/blog/keep-nodejs-rockin-in-docker/)
- [PM2 and Docker - Choosing the Right Process Manager - Leapcell](https://leapcell.io/blog/pm2-and-docker-choosing-the-right-process-manager-for-node-js-in-production)
