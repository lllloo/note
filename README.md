# VitePress + Docker Compose 使用說明

## 需求
- Docker
- Docker Compose

## 專案結構
```
docker-compose.yml
dockerfile
package.json
docs/
```

## 步驟

### 1. 以 Docker Compose 打包 VitePress 靜態網站

```pwsh
docker-compose up --build
```

執行後，VitePress 靜態網站會自動打包，輸出到 `docs/.vitepress/dist`，容器結束後可直接取得靜態檔案。

### 2. 目錄說明
- `docs/`：VitePress 內容目錄
- `docker-compose.yml`：一鍵打包 VitePress 靜態網站
- `dockerfile`：VitePress 打包用 Docker 設定

### 3. 注意事項
- 靜態檔案會輸出到 `docs/.vitepress/dist`
- 若內容有更新，請重新執行 `docker-compose up --build`
- 若需啟用 Nginx 服務，請取消 `docker-compose.yml` 內相關註解

---

## networks 說明

目前預設未啟用自定義 network，若需讓多服務（如 Nginx）共用同一 network，請參考下方設定：

1. 先建立外部 network：
   ```pwsh
   docker network create web
   ```
2. 在 `docker-compose.yml` networks 區塊指定 external network：
   ```yaml
   networks:
     web:
       external: true
   ```
3. 服務指定使用 web network：
   ```yaml
   services:
     app1:
       # ...existing code...
       networks:
         - web
   ```

---

參考：[VitePress 官方部署文件](https://vitepress.dev/guide/deploy)
