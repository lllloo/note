# Vercel Skills 使用指南 - 實作計畫

## Context

使用者希望撰寫一篇關於 Vercel Labs Skills 的使用指南,目標是讓 VSCode 和 Claude Code 的使用者都能學會如何安裝和管理 AI 編碼技能。這篇文章將放在專案的 AI 應用指南區塊 (`docs/ai/guides/`)。

**為何需要這篇文章:**
- Vercel Skills 是一個跨代理的 AI 技能生態系統,支援 Claude Code、Cursor、GitHub Copilot 等 35+ 種代理
- 專案目前已有 Instructions 和 Prompts 的使用指南,但缺少 Skills 的完整教學
- Skills 可提供可執行的腳本技能,與 Instructions/Prompts 形成互補
- 幫助開發者快速安裝 Vercel 官方技能集(如 react-best-practices、web-design-guidelines 等)

## 實作方案

### 1. 建立主要文章 `docs/ai/guides/vercel-skills.md`

**文章結構** (目標 70-90 行):

```markdown
# Vercel Skills 使用指南

簡介段落: 說明 Vercel Skills 是 AI 編碼代理的技能生態系統 CLI 工具

[[toc]]

## 什麼是 Vercel Skills
- Skills 核心概念與跨代理支援特性
- 與 Instructions/Prompts 的互補關係
- 主要使用場景

## 安裝 Skills CLI
- 前置需求 (Node.js)
- 使用 npx 執行 (無需全域安裝)

## 基本使用方式

### 安裝技能集
- 完整技能集安裝: `npx skills add vercel-labs/agent-skills --all -a claude-code -y`
- 互動式選擇: `npx skills add vercel-labs/agent-skills -a claude-code`
- 指定特定技能: `npx skills add vercel-labs/agent-skills --skill react-best-practices -a claude-code -y`

### 管理已安裝技能
- 列出技能: `npx skills list -a claude-code`
- 移除技能: `npx skills remove <skill-name> -a claude-code -y`
- 檢查更新: `npx skills check -a claude-code`

### 技能目錄位置
- Claude Code 專案級: `.claude/skills/`
- Claude Code 全域級: `~/.claude/skills/` (Windows: `~\.claude\skills\`)
- 通用路徑: `.github/skills/`, `.agents/skills/`

## 實戰範例

### 範例 1: 為 Claude Code 安裝 React 最佳實踐技能
完整的指令、輸出範例、驗證步驟

### 範例 2: 管理多個技能
列出、移除、更新技能的完整流程

## Vercel 官方技能集推薦
- react-best-practices: 40+ React/Next.js 優化規則
- web-design-guidelines: 100+ 設計與可訪問性規則
- composition-patterns: 解決布林屬性過度增生問題
- (3-5 個最實用的技能,每個 2-3 行說明)

## 進階使用
- 從 GitHub/GitLab 倉庫安裝
- 從本地路徑安裝
- 自訂技能開發基礎 (SKILL.md 結構簡介)

## 與專案 Instructions/Prompts 的搭配使用
- 三種檔案類型的比較表格
- 推薦工作流程
- 連結到專案現有的 Instructions/Prompts 指南

## 常見問題
- 技能無法執行怎麼辦?
- 如何解決路徑衝突?
- 如何更新過時技能?

## 參考資源
- Vercel Skills GitHub
- 官方技能集連結
```

**撰寫重點:**
- 一律使用繁體中文,技術術語保留英文
- 每個 CLI 指令後都附帶實際輸出範例
- 所有範例都標註 `-a claude-code` 確保針對 Claude Code
- 路徑說明區分 Windows 與 macOS/Linux
- 至少提供 2 個完整的端到端實戰範例

### 2. 更新 VitePress 設定檔

**檔案:** `docs/.vitepress/config.mts`
**修改位置:** 第 253 行之後

```typescript
{
  text: '使用指南',
  items: [
    { text: '符號連結建立指令', link: '/ai/guides/symbolic-link' },
    { text: 'Vercel Skills 使用指南', link: '/ai/guides/vercel-skills' }, // 新增
  ],
},
```

### 3. 更新 AI 應用首頁

**檔案:** `docs/ai/index.md`
**修改位置:** 第 13 行之後

新增段落:

```markdown
### Vercel Skills 使用指南

學習如何使用 Vercel Skills CLI 工具安裝和管理 AI 編碼技能,提升開發效率。

- [Vercel Skills 使用指南](./guides/vercel-skills)
```

## Critical Files

1. **`docs/ai/guides/vercel-skills.md`** (新建) - 主要文章內容
2. **`docs/.vitepress/config.mts`** (修改 L253 後) - Sidebar 設定
3. **`docs/ai/index.md`** (修改 L13 後) - 首頁連結

## 驗證步驟

### 1. Markdown 格式檢查
```bash
npm run lint:md
```
預期: 無錯誤輸出

### 2. 開發伺服器驗證
```bash
npm run docs:dev
```

檢查項目:
- [ ] 訪問 `http://localhost:5175/ai/`
- [ ] 確認 sidebar 顯示「Vercel Skills 使用指南」
- [ ] 點擊連結,頁面正常載入
- [ ] 檢查目錄 (TOC) 正常生成
- [ ] 測試所有內部連結可正常跳轉

### 3. 建構驗證
```bash
npm run docs:build
```

預期:
- 建構成功
- `docs/.vitepress/dist/ai/guides/vercel-skills.html` 生成
- `llms.txt` 包含新文章內容

### 4. 內容品質檢查

- [ ] 檔名符合 kebab-case: `vercel-skills.md`
- [ ] 包含 `[[toc]]` 目錄區塊
- [ ] 所有指令都標註 `-a claude-code`
- [ ] 每個 CLI 指令後都有輸出範例
- [ ] 路徑說明包含 Windows 與 macOS/Linux 雙版本
- [ ] 內部連結使用相對路徑
- [ ] 提供至少 2 個完整實戰範例
- [ ] 推薦至少 3 個 Vercel 官方技能
- [ ] 包含與 Instructions/Prompts 的比較表格

## 實作順序

1. 建立 `docs/ai/guides/vercel-skills.md`,撰寫完整內容
2. 更新 `docs/.vitepress/config.mts` sidebar
3. 更新 `docs/ai/index.md` 首頁
4. 執行 `npm run lint:md` 檢查格式
5. 執行 `npm run docs:dev` 驗證連結
6. 執行 `npm run docs:build` 確認建構成功

## 關鍵資訊參考

**Vercel Skills 主要指令:**
- 安裝: `npx skills add <source> [options]`
- 列出: `npx skills list -a <agent>`
- 移除: `npx skills remove <skill> -a <agent>`
- 檢查: `npx skills check -a <agent>`

**Claude Code 技能路徑:**
- 專案級: `.claude/skills/`
- 全域級: `~/.claude/skills/` (Windows: `~\.claude\skills\`)

**官方技能集來源:**
- GitHub: `vercel-labs/agent-skills`
- 包含: react-best-practices, web-design-guidelines, composition-patterns 等

**與專案體系的整合:**
- Instructions: 持續性指引,開啟檔案時自動生效 (`docs/guide/instructions/`)
- Prompts: 一次性任務範本,手動呼叫 (`docs/guide/prompts/`)
- Skills: 可執行腳本技能,主動執行 (本文介紹)
