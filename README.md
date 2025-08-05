# Barney's Notes - 筆記管理系統

> 基於 VitePress 建構的個人筆記與學習指南網站

## 📖 專案簡介

這是一個使用 VitePress 建構的筆記管理系統，主要收集並整理各種技術筆記與學習資源。網站內容涵蓋前端開發、JavaScript、TypeScript、CSS、Docker、Git 等多個技術領域的實用筆記。

## 🚀 線上瀏覽

- **網站連結**：[https://bugloop.com](https://bugloop.com)
- **GitHub 倉庫**：[https://github.com/lllloo/note](https://github.com/lllloo/note)

## 📁 內容結構

### 主要分類

- **前端相關**：前端開發技巧與工具

- **JavaScript**：JavaScript 開發筆記

- **TypeScript**：TypeScript 相關技術

- **CSS**：樣式設計與技巧

- **Docker**：容器化技術

- **Git**：版本控制

## 💻 本地開發

### 環境需求

- Node.js (建議使用最新 LTS 版本)
- npm

### 安裝與啟動

```bash
# 克隆專案
git clone https://github.com/lllloo/note.git

# 進入專案目錄
cd note

# 安裝相依套件
npm install

# 啟動開發伺服器
npm run docs:dev

# 瀏覽器開啟 http://localhost:5175
```

### 可用指令

```bash
# 開發模式 (預設 port 5175)
npm run docs:dev

# 建構生產版本
npm run docs:build

# 預覽建構結果
npm run docs:preview
```

## 📝 文件結構

```
docs/
├── .vitepress/          # VitePress 配置
│   ├── config.mts       # 網站配置檔
│   └── theme/           # 主題客製化
├── guide/               # 使用指南
│   └── markdown.md      # Markdown 編寫規範
├── notes/               # 主題筆記
│   ├── frontend/        # 前端相關
│   ├── js/             # JavaScript
│   ├── typescript/      # TypeScript
│   ├── css/            # CSS
│   ├── docker/         # Docker
│   └── git/            # Git
├── public/             # 靜態資源
└── index.md            # 網站首頁
```

## 📧 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯絡：

- 📧 透過 GitHub Issues 提出問題
- 🔗 專案連結：[https://github.com/lllloo/note](https://github.com/lllloo/note)

## 📄 授權條款

本專案採用開源授權，詳細內容請參考 LICENSE 檔案。
