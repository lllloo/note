# Barney's Notes — 筆記管理

使用 VitePress 建構的個人技術筆記網站，部署於 [https://bugloop.com](https://bugloop.com)。內容涵蓋前端開發、JavaScript/TypeScript、CSS、Docker、Git 等技術筆記，以及 AI 開發指南。

## 快速連結

- 網站: [https://bugloop.com](https://bugloop.com)
- 網站（llms）: [https://bugloop.com/llms.txt](https://bugloop.com/llms.txt)
- 網站（llms-full）: [https://bugloop.com/llms-full.txt](https://bugloop.com/llms-full.txt)
- 原始碼: [https://github.com/lllloo/note](https://github.com/lllloo/note)

## 專案架構

```text
docs/                           # VitePress 網站內容根目錄
├── .vitepress/
│   └── config.mts              # VitePress 設定檔 (nav、sidebar、插件等)
├── notes/                      # 技術筆記
│   ├── frontend/               # 前端開發
│   ├── js/                     # JavaScript
│   ├── typescript/             # TypeScript
│   ├── css/                    # CSS
│   ├── docker/                 # Docker
│   ├── git/                    # Git
│   ├── auth/                   # 驗證與安全
│   └── library/                # 函式庫與工具
├── ai/                         # AI 應用相關使用指南
├── issues/                     # 常見問題與解決方案
└── guide/                      # AI 開發指南
    ├── instructions/           # GitHub Copilot 持續性技術指引 (*.instructions.md)
    ├── prompts/                # 一次性任務指令 (*.prompt.md)
    └── conventional-commits.md # Commit 訊息規範
```

## 常用指令

```bash
# 安裝相依套件
npm ci

# 開發模式 (port 5175)
npm run docs:dev

# 建構靜態檔案
npm run docs:build

# 預覽建構結果 (本地)
npm run docs:preview

# 檢查 Markdown 格式
npm run lint:md

# 自動修正 Markdown 問題
npm run lint:md:fix
```

## 主要功能

### llms.txt 自動生成

- 使用 `vitepress-plugin-llms` 插件自動生成 AI 可讀的網站內容索引
- `llms.txt`: 簡化版索引 (僅包含主要內容)
- `llms-full.txt`: 完整版索引 (包含所有頁面內容)
- 在執行 `npm run docs:build` 時自動生成

## 開發注意事項

### 新增文章流程

1. 在 `docs/` 對應目錄下建立 `.md` 檔案
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 物件中新增對應項目
3. 確保 sidebar 的 `link` 路徑與實際檔案路徑一致 (不含 `.md` 副檔名)
4. 執行 `npm run docs:dev` 驗證連結正常運作

### 重要慣例

- **語言**: 一律使用繁體中文撰寫所有內容 (技術術語可保留英文)
- **Markdown 規範**: 使用 `markdownlint-cli2` 檢查，設定位於 `package.json`
- **Commit 訊息**: 遵循 Conventional Commits 規範
- **AI 檔案命名**: 使用 kebab-case，Instructions 為 `*.instructions.md`，Prompts 為 `*.prompt.md`

### 嚴格限制

- 不要在 `docs/` 以外的路徑新增網站內容
- 不要變更 `package.json` 的 lint 設定或 VitePress 腳本 (除非有充分理由)
- 修改 VitePress 設定檔前先確認影響範圍

## 📧 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯絡：

- 📧 透過 GitHub Issues 提出問題
- 🔗 專案連結：[https://github.com/lllloo/note](https://github.com/lllloo/note)

## 📄 授權條款

本專案採用開源授權，詳細內容請參考 LICENSE 檔案。
