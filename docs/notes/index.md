# 筆記

本文件彙整各類技術主題筆記,涵蓋前端開發、JavaScript/TypeScript、CSS、Docker、Git 等領域,記錄實用技術要點與最佳實踐。

[[toc]]

## 前端開發

前端開發相關的實用技巧與解決方案,包含表單處理、檔案操作、安全性設定等主題。

- [數字/小數點輸入限制](./frontend/input-number) - 實現數字輸入欄位的格式限制
- [檔案下載](./frontend/file-download) - 處理檔案下載功能的實作方式
- [安全使用 target="_blank"](./auth/target-blank-security) - 避免新視窗開啟的安全性風險
- [剪貼簿複製文字](./frontend/clipboard) - 實現複製文字至剪貼簿功能

## 驗證與安全

身份驗證與安全性相關的技術筆記,包含 Token 機制、權限管理等主題。

- [Token 機制 (Access/Refresh)](./auth/token-refresh) - 實作 Access Token 與 Refresh Token 的刷新機制

## Library

常用第三方函式庫的使用筆記與整合技巧。

- [Paged.js](./library/paged-js) - 分頁列印與 PDF 生成函式庫
- [FullCalendar](./library/fullcalendar) - 功能完整的行事曆元件

## JavaScript

JavaScript 核心觀念、API 使用與開發工具相關筆記。

- [Date](./js/date) - 日期時間處理技巧
- [數字計算與格式化](./js/number) - 使用 big.js 進行精確計算與格式化
- [cookie](./js/cookie) - Cookie 操作方法
- [URL query string](./js/URLQueryString) - URL 查詢參數處理
- [深拷貝 structuredClone](./js/deep-clone) - 使用原生 API 進行深拷貝

## npm

npm 套件管理、版本更新與開發環境工具相關筆記。

- [npm 套件更新與檢查指令](./npm/update) - 套件版本更新與檢查
- [Volta](./npm/volta) - Node.js 版本管理工具

## TypeScript

TypeScript 型別系統、型別註解與工具類型應用。

- [JSDoc 型別註解](./typescript/jsdoc) - 使用 JSDoc 進行型別標註
- [Vue 的 JSDoc 型別註解](./typescript/vue-jsdoc) - Vue 專案中的 JSDoc 型別標註
- [TS 工具類型](./typescript/utility-types) - TypeScript 內建工具類型使用方式

## CSS

CSS 樣式技巧、排版處理與常見佈局解決方案。

- [換行](./css/newline) - 文字換行處理技巧
- [圖片](./css/img) - 圖片樣式與響應式處理
- [捲軸](./css/scroller) - 自訂捲軸樣式
- [最後一行移除下邊框](./css/remove-last-row-border) - 表格或列表樣式優化

## Docker

Docker 容器化技術的使用筆記與維護技巧。

- [清理](./docker/clear) - Docker 資源清理與空間管理
- [Docker Compose](./docker/compose) - Docker Compose 使用方式整理
- [網路隔離：只暴露 Nginx](./docker/network) - 多服務架構只開放 Nginx port，其餘服務走內部網路
- [Nuxt 4 Dockerfile](./docker/nuxt4) - Nuxt 4 的開發與部署容器化寫法
- [Docker 不需要 PM2](./docker/pm2) - 容器環境中以 Docker 原生機制取代 PM2
- [Laradock 常用指令](./docker/laradock) - Laradock PHP 開發環境的常用操作

## Git

版本控制系統 Git 的設定與常用指令。

- [設定](./git/setting) - Git 環境設定與個人化配置
- [指令](./git/command) - 常用 Git 指令整理

## GitHub Actions

GitHub Actions 自動化工作流程相關筆記。

- [寄送 Discord 通知](./github-actions/discord-notify) - 在 CI/CD 流程中發送 Discord 通知訊息
