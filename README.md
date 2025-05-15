# VitePress + Docker Compose 快速指南

## 需求
- Docker
- Docker Compose

## 專案結構
```
docker-compose.yml
Dockerfile
package.json
docs/
```

## 使用步驟

### 1. 打包 VitePress 靜態網站

```sh
docker-compose up --build
```
- 執行後，靜態網站會自動打包至 `docs/.vitepress/dist`。
- 容器結束後，可直接取得靜態檔案。

### 2. 目錄說明
- `docs/`：VitePress 內容目錄
- `docker-compose.yml`：一鍵打包 VitePress 靜態網站
- `Dockerfile`：VitePress 打包用 Docker 設定

### 3. 注意事項
- 靜態檔案輸出於 `docs/.vitepress/dist`
- 內容更新需重新執行 `docker-compose up --build`
- 若需啟用 Nginx，請取消 `docker-compose.yml` 內相關註解

---

## networks 使用說明

預設未啟用自定義 network。若需多服務（如 Nginx）共用同一 network，請依下列步驟設定：

1. 建立外部 network：
   ```sh
   docker network create web
   ```
2. 在 `docker-compose.yml` 加入 external network 設定：
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

## 參考資料

- [VitePress 官方部署文件](https://vitepress.dev/guide/deploy)
