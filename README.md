# VitePress + Nginx Docker 專案

## 專案結構

- `vitepress/`：VitePress 原始碼與 Dockerfile
- `nginx/`：Nginx 設定與 log 目錄
- `docker-compose.yml`：服務協調與 volume 掛載

## 建置與啟動

1. 建立靜態網站並啟動 Nginx 服務：

```powershell
docker compose up --build
```

2. 服務啟動後，瀏覽器開啟 http://localhost 查看網站。

## 主要流程

- multi-stage build：
  - 第一階段用 Node 建構 VitePress 靜態檔案
  - 第二階段用 Nginx 服務靜態檔案
- Nginx 設定檔（`nginx/default.conf`）會自動掛載到 container
- log 目錄可在 `nginx/log/` 取得

## 常見問題

- 如需修改 Nginx 設定，請直接編輯 `nginx/default.conf`，重啟服務即可生效。
- 若要調整 VitePress 內容，請修改 `vitepress/docs/` 內容並重新 build。

## 參考指令

- 停止服務：
  ```powershell
  docker compose down
  ```
- 查看 log：
  ```powershell
  cat nginx/log/access.log
  cat nginx/log/error.log
  ```
