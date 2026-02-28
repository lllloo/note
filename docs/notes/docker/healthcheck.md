# Docker HEALTHCHECK：確保服務真正就緒

Docker 的 `HEALTHCHECK` 指令可以讓 Docker 定期檢查容器內的服務是否正常運作。當健康檢查失敗時，容器狀態會標記為 `unhealthy`，讓編排工具（如 Docker Compose、Swarm）能做出對應處理，而不是在服務尚未準備好時就把流量送進去。

[[toc]]

## 為什麼需要 HEALTHCHECK？

容器「啟動」不等於服務「就緒」。例如：

- Node.js 應用程式正在等待資料庫連線
- Nginx 正在等待後端服務啟動
- 資料庫初始化需要幾秒鐘

沒有健康檢查時，Docker 看到容器 Process 跑起來就認定「正常」，`depends_on` 也就直接放行依賴服務進來，導致連線失敗或啟動錯誤。

## 不用 HEALTHCHECK 會怎樣？

`HEALTHCHECK` 是選用的，不設定也能正常運行，但 Docker 對容器狀態的判斷會變得很粗糙：

| 情境 | 有 HEALTHCHECK | 沒有 HEALTHCHECK |
| :--- | :--- | :--- |
| 容器狀態 | `healthy` / `unhealthy` / `starting` | 只有 `running` 或 `exited` |
| 程序 crash（exit） | 偵測到，搭配 `restart` 重啟 | 同樣偵測到，搭配 `restart` 重啟 |
| 程序卡住（未 exit） | 標記 `unhealthy`，可自動處理 | **無法偵測**，容器仍顯示 running |
| `depends_on` 啟動順序 | 可用 `service_healthy` 等服務就緒 | 只能用 `service_started`，不保證就緒 |
| Swarm 滾動更新 | 等新容器 healthy 才移除舊容器 | 啟動即視為就緒，可能造成短暫中斷 |

### 什麼時候可以不用

- 開發環境或一次性任務容器
- 服務很單純，crash 就會直接 exit，搭配 `restart` 政策已夠用
- 外部已有監控機制（如 Kubernetes liveness / readiness probe 取代 Dockerfile HEALTHCHECK）

### 什麼時候一定要用

- 服務可能卡住但不 crash（event loop 卡死、deadlock、記憶體洩漏）
- 有 `depends_on` 需要等依賴服務真正就緒
- 使用 Docker Swarm 做滾動更新，需要確認新容器就緒才切流量
- 搭配 `autoheal` 等工具自動重啟異常容器

## Dockerfile 語法

```dockerfile
HEALTHCHECK [OPTIONS] CMD <command>
```

### 選項

| 選項 | 預設值 | 說明 |
| :--- | :--- | :--- |
| `--interval` | `30s` | 執行檢查的間隔時間 |
| `--timeout` | `30s` | 單次檢查的逾時時間 |
| `--start-period` | `0s` | 容器啟動初始化的寬限時間，期間失敗不計入重試次數 |
| `--start-interval` | `5s` | 寬限期間的檢查間隔（Docker 25.0+） |
| `--retries` | `3` | 判定為 unhealthy 前允許失敗的次數 |

### 關閉繼承的健康檢查

若使用的 base image 已有 `HEALTHCHECK`，但你不需要，可用以下語法停用：

```dockerfile
HEALTHCHECK NONE
```

## 常見範例

### HTTP 服務

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

> 需確認 image 內有安裝 `curl`。Slim/Alpine image 通常需要自行安裝，或改用 `wget`。

使用 `wget`：

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
```

### 資料庫（PostgreSQL）

```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} || exit 1
```

### 資料庫（MySQL / MariaDB）

```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1
```

### Redis

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD redis-cli ping || exit 1
```

### TCP Port 檢查

若服務不提供 HTTP endpoint，可用 `bash` 或 `nc` 檢查 port 是否可連：

```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD bash -c 'echo > /dev/tcp/localhost/3000' || exit 1
```

## 在 Docker Compose 中使用

### 定義健康檢查

可以在 `compose.yml` 內為服務加上 `healthcheck`，不需要修改 Dockerfile：

```yaml
services:
  app:
    build: .
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 5s
      start_period: 10s
      retries: 3
```

### depends_on 搭配 service_healthy

這是 HEALTHCHECK 最實用的應用場景 — 確保依賴服務真正就緒後才啟動：

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user -d mydb']
      interval: 10s
      timeout: 5s
      start_period: 30s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy  # 等 db healthy 才啟動
```

`condition` 有三種值：

| condition | 說明 |
| :--- | :--- |
| `service_started`（預設） | 容器啟動即繼續，不管是否就緒 |
| `service_healthy` | 等健康檢查通過才繼續 |
| `service_completed_successfully` | 等容器正常結束（適合 init 類 job） |

## 查看健康狀態

```sh
# 查看所有容器的健康狀態
docker ps

# 查看特定容器的健康檢查紀錄
docker inspect --format='{{json .State.Health}}' <container_name> | jq
```

輸出的 `Status` 有三種：

- `starting` — 尚在寬限期或等待第一次檢查
- `healthy` — 最近一次（或多次）檢查通過
- `unhealthy` — 連續失敗達 `retries` 次

## 注意事項

- `start_period` 期間的失敗**不會**計入 `retries`，讓服務有足夠時間初始化
- Slim / Alpine image 通常沒有 `curl`，使用前需在 Dockerfile 中安裝，或改用 `wget` / `bash /dev/tcp`
- 健康檢查的 command 回傳 `0` 表示健康，`1` 表示失敗
- 不建議把 `--interval` 設太短，頻繁執行會增加容器 CPU 負擔

## 參考資料

- [Docker 官方文件 — HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck)
- [Docker Compose — depends_on](https://docs.docker.com/compose/how-tos/startup-order/)
