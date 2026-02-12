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
  - `guide/` — AI 開發指南(instructions 與 prompts)
  - `notes/` — 技術筆記(frontend, js, typescript, css, docker, git 等分類)
  - `issues/` — 常見問題與解決方案

### VitePress 設定重點

- 設定檔: `docs/.vitepress/config.mts`
- 使用 `vitepress-plugin-llms` 插件自動生成 `llms.txt` 和 `llms-full.txt`
- 站點語言: zh-TW
- Markdown inline code 自動加上 `v-pre` 屬性以避免 Vue 插值
- **Sidebar 定義在 config.mts 中**:新增或移動文章時,必須同步更新對應的 sidebar 項目,確保 `link` 路徑正確且檔案存在

### AI 指南結構

本專案區分兩種 AI 輔助檔案類型:

**Instructions** (`docs/guide/instructions/*.instructions.md`):

- 持續性的技術指引,GitHub Copilot 開啟符合 `applyTo` 條件的檔案時自動生效
- YAML frontmatter 必須包含 `description` 與 `applyTo`(glob pattern)

**Prompts** (`docs/guide/prompts/*.prompt.md`):

- 一次性的任務指令,手動呼叫時使用
- YAML frontmatter 必須包含 `mode`(ask/edit/agent)和 `description`

## 重要慣例

### 語言

**一律使用繁體中文**撰寫所有內容。技術術語可保留英文,說明文字必須使用繁體中文。

### Markdown 規範

- 使用 `markdownlint-cli2` 檢查,設定位於 `package.json` 的 `markdownlint-cli2` 欄位
- 已關閉規則: MD013(行長度限制)
- `no-duplicate-heading` 設定為 `siblings_only: true`

### Commit 訊息

遵循 Conventional Commits 規範(參考 `docs/guide/conventional-commits.md`):

```
<type>[optional scope]: <description>
```

常用 type: `feat`(新功能)、`fix`(修復)、`docs`(文件)、`style`(格式)、`refactor`(重構)、`chore`(其他)

### AI 檔案命名

檔名一律使用 kebab-case:Instructions 為 `*.instructions.md`,Prompts 為 `*.prompt.md`。

## 開發限制

- 不要在 `docs/` 以外的路徑新增網站內容
- 不要變更 `package.json` 的 lint 設定或 VitePress 腳本,除非有充分理由
- 修改 VitePress 設定檔前先確認影響範圍
- Instructions 的 `applyTo` glob pattern 必須正確,否則不會在預期檔案中生效

## 相關資源

- 專案 GitHub: <https://github.com/lllloo/note>
- 線上網站: <https://bugloop.com>
- VitePress 文件: <https://vitepress.dev>
- Conventional Commits: <https://www.conventionalcommits.org/zh-hant/v1.0.0/>
