# Docker 與 PM2：用或不用的取捨

在容器化環境中，PM2 的多數功能可由 Docker 原生機制取代，直接在容器內跑 `pm2 start` 是常見的反模式。但 PM2 官方也提供了容器專用的 `pm2-runtime`，有其適用場景。本文整理兩種做法，並比較差異幫助選擇。

[[toc]]

## 為什麼不該在 Docker 直接用 PM2

直接在容器內使用 `pm2 start` 會造成以下問題：

- **容器立即退出**：PM2 daemon 模式會 fork 到背景，容器主程序結束後容器隨即停止
- **信號無法傳遞**：PM2 作為 PID 1 運行，`docker stop` 發出的 SIGTERM 由 PM2 接收，不一定正確轉發給 Node.js，導致 graceful shutdown 失效
- **職責重疊**：容器本身就是隔離單元，Docker / Kubernetes 已負責程序監控與重啟，PM2 是多餘的一層
- **增加複雜度**：額外增加 image 大小與啟動流程的複雜度

## 做法一：純 Docker 取代 PM2（推薦）

Dockerfile 直接用 `node` 啟動應用，搭配 Docker 原生機制處理所有 PM2 做的事：

```dockerfile
CMD ["node", "app.js"]
```

### 自動重啟

Docker Compose 的 `restart` 取代 PM2 的 crash 重啟：

```yaml
services:
  app:
    restart: unless-stopped
```

| 值 | 行為 |
| --- | --- |
| `no` | 不自動重啟（預設） |
| `always` | 永遠重啟，包含手動 stop 後再 daemon 啟動 |
| `unless-stopped` | 除非手動 stop，否則永遠重啟 |
| `on-failure` | 只在非正常結束時重啟（exit code 非 0） |

### 健康監控

`restart` 只處理容器 crash（exit）。若 Node.js 內部卡住（event loop 卡死、記憶體洩漏）但沒有 exit，需要 `HEALTHCHECK` 偵測：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD node healthcheck.js
```

`healthcheck.js` 用原生 `http` 模組打健康檢查端點（slim image 不一定有 curl）：

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

> `HEALTHCHECK` 只負責回報狀態。在 Docker Swarm / Kubernetes 中，unhealthy 容器會被自動替換；單純 `docker compose` 環境需搭配 `autoheal` 等工具才能自動重啟 unhealthy 容器。

### 多核心利用

PM2 cluster 模式讓單台機器跑多個 worker 利用多核心，在 Docker 中有兩種替代方案：

**多容器副本（推薦）：**

```bash
docker compose up --scale app=4
```

```yaml
# Docker Swarm / Kubernetes
services:
  app:
    deploy:
      replicas: 4
```

> `deploy.replicas` 只在 Docker Swarm 或 Kubernetes 生效，一般 `docker compose` 請用 `--scale`。

**Nitro 內建 cluster preset（Nuxt 4 適用）：**

```yaml
environment:
  - NITRO_PRESET=node_cluster
```

### 記憶體限制

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
    restart: on-failure
```

搭配 `--max-old-space-size` 讓 Node.js 有機會觸發 GC 而非被 Docker 強制 OOM kill：

```dockerfile
CMD ["node", "--max-old-space-size=450", ".output/server/index.mjs"]
```

> 設略低於 Docker 的記憶體上限，例如 Docker 限制 512M 則 V8 設 450M。

## 做法二：使用 pm2-runtime

PM2 官方針對容器環境提供 `pm2-runtime`，用來解決（或至少大幅改善）直接在容器內用 `pm2 start` 時會遇到的主要問題。

### 與一般 PM2 的差異

| 特性 | `pm2 start` | `pm2-runtime` |
| --- | --- | --- |
| 執行方式 | fork 到背景（daemon） | 前景執行，作為容器主程序 |
| 信號處理 | 不轉發 SIGTERM | 正確轉發 SIGINT / SIGTERM |
| 容器相容性 | 容器會立即退出 | 持續運行，相容容器生命週期 |
| crash 處理 | — | 容器內立即重啟，不需重建容器 |

### 基本用法

```dockerfile
FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm install pm2 -g

COPY . .
CMD ["pm2-runtime", "app.js"]
```

### 搭配 ecosystem 設定

建立 `ecosystem.config.js` 啟用 cluster 模式與記憶體限制：

```js
module.exports = {
  apps: [{
    name: 'app',
    script: './app.js',
    instances: 2,           // cluster 數量
    exec_mode: 'cluster',   // 啟用 cluster 模式
    max_memory_restart: '500M',
    kill_timeout: 3000,     // graceful shutdown 等待時間（ms）
  }]
}
```

```dockerfile
CMD ["pm2-runtime", "ecosystem.config.js"]
```

### Graceful Shutdown

在 Docker 中，`docker stop` 會先對容器內的 PID 1 發送 SIGTERM；當以 `pm2-runtime` 作為 PID 1 執行時，`pm2-runtime` 會在收到停止信號後轉發 SIGINT 給應用，預設等 1600ms 後送 SIGKILL。因此應用程式至少需要處理 SIGINT，若未來可能直接由 Docker 啟動（不經 `pm2-runtime`），建議同時處理 SIGINT / SIGTERM：

```js
function gracefulShutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
```

### 日誌輸出格式

`pm2-runtime` 預設將日誌輸出到 stdout/stderr，也可指定格式方便日誌系統解析：

```dockerfile
CMD ["pm2-runtime", "--json", "ecosystem.config.js"]
```

| 參數 | 格式 | 適用場景 |
| --- | --- | --- |
| `--json` | JSON（logstash 相容） | ELK、Loki 等日誌系統 |
| `--format` | `key=value` | 結構化日誌 |
| `--raw` | 原始輸出 | 開發除錯 |

## 比較與選擇

### 功能對照表

| PM2 功能 | 純 Docker | pm2-runtime |
| --- | --- | --- |
| crash 重啟 | `restart: unless-stopped` | 容器內自動重啟 |
| 健康監控 | `HEALTHCHECK` + healthcheck.js | 無（僅程序存活檢查） |
| 多核心 cluster | 多容器副本 / Nitro preset | `exec_mode: 'cluster'` |
| 記憶體限制 | Docker `resources.limits.memory` | `max_memory_restart` |
| 日誌管理 | `docker compose logs` / 集中式日誌 | stdout + 格式化選項 |
| Graceful shutdown | Node.js 直接處理 SIGTERM | `kill_timeout` + 信號轉發 |
| Zero-downtime | 滾動更新（Swarm / K8s） | `pm2 reload` |

### 重啟速度

| 情境 | 純 Docker | pm2-runtime |
| --- | --- | --- |
| crash → 服務恢復 | ~700ms | ~500ms |
| 含 healthcheck 確認 | ~1200ms | 無 healthcheck |

pm2-runtime 在容器內重啟程序，不需重建容器，速度略快。但 Docker 的 HEALTHCHECK 能偵測更多異常（event loop 卡死等非 crash 情境）。

### 信號處理

| 項目 | 純 Docker（`node`） | pm2-runtime |
| --- | --- | --- |
| PID 1 | Node.js 直接作為 PID 1 | pm2-runtime 作為 PID 1 |
| SIGTERM | Node.js 直接收到 | PM2 轉發給子程序 |
| shutdown 控制 | 應用程式自行處理 | `kill_timeout` 統一控制 |

> Docker 官方建議用 `CMD ["node", "app.js"]`，讓 Node.js 作為 PID 1 直接接收信號，架構最簡潔。

### 怎麼選

**選純 Docker：**

- 已使用 Docker Swarm / Kubernetes 等編排工具
- 追求最小 image 與最簡架構
- 團隊熟悉容器化最佳實踐

**選 pm2-runtime：**

- 單機 Docker，無編排工具
- 需要容器內 cluster 模式利用多核心
- 需要毫秒級 crash recovery
- 從傳統 PM2 部署遷移至 Docker，降低過渡風險

## 參考資料

- [PM2 Docker Integration - PM2 官方文件](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
- [From PM2 to Docker: Cluster Mode - Maxim Orlov](https://maximorlov.com/from-pm2-to-docker-cluster-mode/)
- [To PM2, or Not to PM2: Embracing Docker for Node.js - Medium](https://medium.com/@saderi/to-pm2-or-not-to-pm2-embracing-docker-for-node-js-b4a8adce141c)
- [Top 4 Tactics To Keep Node.js Rockin' in Docker - Docker Blog](https://www.docker.com/blog/keep-nodejs-rockin-in-docker/)
- [PM2 and Docker - Choosing the Right Process Manager - Leapcell](https://leapcell.io/blog/pm2-and-docker-choosing-the-right-process-manager-for-node-js-in-production)
