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
  - 只能輸入數字跟小數點
  - Paged.js 使用指南
  - 前端檔案下載
  - Content-Disposition 相關問題

- **JavaScript**：JavaScript 開發筆記
  - Date 物件操作
  - package.json 更新
  - Volta 版本管理
  - Cookie 操作
  - URL query string 處理

- **TypeScript**：TypeScript 相關技術
  - JSDoc 型別註解

- **CSS**：樣式設計與技巧
  - 換行處理
  - 圖片樣式
  - 捲軸客製化

- **Docker**：容器化技術
  - Docker 清理指令

- **Git**：版本控制
  - Git 設定
  - Git 指令集

## 🛠 技術架構

- **框架**：[VitePress](https://vitepress.dev/) v1.6.3
- **語言**：TypeScript
- **部署**：靜態網站
- **分析**：Google Analytics

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

## 🤝 貢獻指南

歡迎提交問題報告、功能建議或直接貢獻程式碼：

1. Fork 這個專案
2. 建立你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📧 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯絡：

- 📧 透過 GitHub Issues 提出問題
- 🔗 專案連結：[https://github.com/lllloo/note](https://github.com/lllloo/note)

## 📄 授權條款

本專案採用開源授權，詳細內容請參考 LICENSE 檔案。
