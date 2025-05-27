# 筆記管理系統

本專案為一套支援多種格式的筆記管理系統，結合容器化部署與 Nginx 反向代理。

## 目錄結構

- `docs/`：
  - `index.md`：文件首頁
  - `guide/`：使用指南與 Markdown 樣式說明
  - `notes/`：各類主題筆記（如 css、docker、git、js 等）
  - `public/`：靜態資源（如 logo）
- `nginx/`：
  - `default.conf`：Nginx 設定檔
  - `log/`：Nginx 日誌（access.log、error.log）
- `docker-compose.yml`：Docker Compose 設定
- `dockerfile`：應用容器化設定
- `package.json`：Node.js 專案設定（如有）

## 安裝與啟動

1. 安裝 Docker 與 Docker Compose。
2. 於專案根目錄執行：

```shell
docker-compose up --build -d
```

3. 服務啟動後，可透過瀏覽器存取對應網址。

## 文件導覽

- 文件首頁：`docs/index.md`
- 使用指南與樣式：`docs/guide/`
- 主題筆記：`docs/notes/`

## 聯絡方式

如有問題請聯絡專案維護者。
