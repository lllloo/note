# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

使用 VitePress 建構的個人技術筆記網站,部署於 <https://bugloop.com> 。內容涵蓋前端開發、JavaScript/TypeScript、CSS、Docker、Git 等技術筆記,以及 AI 開發指南。

## 常用指令

```bash
npm ci                    # 安裝相依套件
npm run docs:dev          # 開發模式 (port 5175)
npm run docs:build        # 建構靜態檔案
npm run docs:preview      # 預覽建構結果
npm run lint:md           # 檢查 Markdown 格式
npm run lint:md:fix       # 自動修正 Markdown 問題
```

## 專案架構

- `docs/` — VitePress 網站內容根目錄,所有網站內容必須在此目錄下
  - `.vitepress/config.mts` — VitePress 設定檔(含 nav、sidebar、插件等)
  - `notes/` — 技術筆記(frontend, js, typescript, css, docker, git, auth, library 等分類)
  - `ai/` — AI 應用相關使用指南
    - `guides/` — AI 工具使用指南
    - `instructions/` — GitHub Copilot 持續性技術指引(`*.instructions.md`)
  - `issues/` — 常見問題與解決方案

### VitePress 設定重點

- 設定檔: `docs/.vitepress/config.mts`
- 使用 `vitepress-plugin-llms` 插件自動生成 `llms.txt` 和 `llms-full.txt`
- 站點語言: zh-TW
- Markdown inline code 自動加上 `v-pre` 屬性以避免 Vue 插值
- **Sidebar 定義在 config.mts 中**:新增或移動文章時,必須同步更新對應的 sidebar 項目
- Sidebar 分為 3 個獨立群組:`/notes/`、`/ai/`、`/issues/`
- Nav 包含 4 個項目:首頁、AI 應用、筆記、疑難雜症

### 新增文章的完整流程

1. 在 `docs/` 對應目錄下建立 `.md` 檔案
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 物件中新增對應項目
3. 確保 sidebar 的 `link` 路徑與實際檔案路徑一致(不含 `.md` 副檔名)
4. 範例:檔案 `docs/notes/css/newline.md` 對應 sidebar link: `/notes/css/newline`
5. 各群組的首頁由 `index.md` 提供（例如 `docs/notes/index.md` 對應 `/notes/`）
6. 執行 `npm run docs:dev` 驗證連結正常運作

### AI 指南結構

**Instructions** (`docs/ai/instructions/*.instructions.md`):

- 持續性的技術指引,GitHub Copilot 開啟符合 `applyTo` 條件的檔案時自動生效
- YAML frontmatter 必須包含 `description` 與 `applyTo`(glob pattern)
- 範例:

```yaml
---
applyTo: '**/*.vue'
description: 'Vue.js 3 Composition API 最佳實踐指引'
---
```

### llms.txt 自動生成

- 使用 `vitepress-plugin-llms` 插件自動生成 AI 可讀的網站內容索引
- `llms.txt`: 簡化版索引(僅包含主要內容)
- `llms-full.txt`: 完整版索引(包含所有頁面內容)
- 在執行 `npm run docs:build` 時自動生成於 `docs/.vitepress/dist/` 目錄

### 建構輸出與快取

- `docs/.vitepress/dist/` — 建構輸出目錄，由 `.gitignore` 的 `dist/` 規則排除，**不要手動編輯**
- `docs/.vitepress/cache/` — VitePress 快取目錄，亦在 `.gitignore` 中

## 重要慣例

### 語言

**一律使用繁體中文**撰寫所有內容。技術術語可保留英文,說明文字必須使用繁體中文。

### Markdown 規範

- 使用 `markdownlint-cli2` 檢查,設定位於 `package.json` 的 `markdownlint-cli2` 欄位
- 已關閉規則: MD013(行長度限制)
- `no-duplicate-heading` 設定為 `siblings_only: true`

### Commit 訊息

遵循 Conventional Commits 規範:

```text
<type>[optional scope]: <description>
```

常用 type: `feat`(新功能)、`fix`(修復)、`docs`(文件)、`style`(格式)、`refactor`(重構)、`chore`(其他)

### AI 檔案命名

檔名一律使用 kebab-case，Instructions 為 `*.instructions.md`。

## 開發限制與注意事項

### 嚴格限制

- **不要在 `docs/` 以外的路徑新增網站內容** — VitePress 只會處理 `docs/` 目錄內的檔案
- **不要變更 `package.json` 的 lint 設定或 VitePress 腳本** — 除非有充分理由並經過討論
- **修改 VitePress 設定檔前先確認影響範圍** — `config.mts` 的變更會影響整個網站的行為

### 常見陷阱

- Instructions 的 `applyTo` glob pattern 必須正確,否則不會在預期檔案中生效
- Sidebar 的 `link` 路徑不包含 `.md` 副檔名,但必須對應實際的 `.md` 檔案
- Markdown frontmatter 中的 YAML 語法錯誤會導致頁面無法正常顯示
- 新增文章後若未更新 sidebar,使用者將無法從導覽列存取該頁面

## 相關資源

- 專案 GitHub: <https://github.com/lllloo/note>
- 線上網站: <https://bugloop.com>
- VitePress 文件: <https://vitepress.dev>
