---
title: Copilot 使用指引
---

## 快速總覽

此專案是一個以 VitePress 建構的個人技術筆記網站（見 `docs/`），主要用中文（繁體）維護內容。AI 代理應聚焦於內容編輯、Markdown 質量檢查與 prompt 範例自動化。

## 大方向（Big Picture）

- 架構：靜態網站內容保存在 `docs/`，由 VitePress 建構與預覽（開發伺服器與靜態建構）。
- 主要責任邊界：
  - 內容維護：所有文章與指南在 `docs/`（包含 `docs/guide/` 的 agent 指南與 prompts 範例）。
  - QA / Lint：使用 `markdownlint-cli2` 檢查 Markdown 標準（設定在 `package.json`）。
- 為何如此設計：專案目的為個人筆記（快速編輯與發布），以靜態站點工具鏈（VitePress）實現最小複雜度。

## 重要檔案與範例（建議先讀）

- [README.md](README.md)：專案總覽與常用指令清單。
- [package.json](package.json)：npm 腳本（`docs:dev`, `docs:build`, `docs:preview`, `lint:md`）與 markdownlint 設定。
- [docs/](docs/)：網站內容總覽。
- [docs/guide/instructions/copilot-instructions.instructions.md](docs/guide/instructions/copilot-instructions.instructions.md)：現有專案級編碼與文件規範（含語言偏好）。
- [docs/guide/prompts/](docs/guide/prompts/)：prompt 範例，採用 front-matter（例如 `mode: 'agent'`）來說明 agent 用法。
- [docs/guide/conventional-commits.md](docs/guide/conventional-commits.md)：提交訊息慣例（若需自動化 commit 相關工作務必遵守）。

## 開發與驗證工作流程（要用的命令）

- 安裝相依：`npm ci`
- 本機開發（即時預覽）：`npm run docs:dev`（VitePress，預設 `docs/` 目錄，port 5175）
- 建構靜態檔：`npm run docs:build`
- 本機預覽建構結果：`npm run docs:preview`
- 檢查 Markdown：`npm run lint:md`
- 自動修正 Markdown 問題：`npm run lint:md:fix`

## 專案慣例與注意事項（針對 AI 代理）

- 語言：所有內容使用繁體中文（一律）。在變更任何內容前，請確認用語與既有條目一致。
- 檔案格局：以 `docs/` 為來源；不要在其他路徑生成網站內容。
- Prompt 與 agent 模式：`docs/guide/prompts/*.prompt.md` 範例使用 front-matter（例如 `mode: 'agent'`、`description`）。當你生成或修改 agent prompt，請維持相同的 front-matter 結構與欄位。
- Markdown 風格：專案使用 `markdownlint-cli2`，其設定位於 `package.json`（例：關閉 MD013），請先用 `npm run lint:md` 檢查再提交。
- Commit 訊息：遵循 `docs/guide/conventional-commits.md` 中的規範。

## 常見任務示例（可直接套用）

- 新增或修改文章：編輯 `docs/<path>.md` → 本機測試 `npm run docs:dev` → 執行 `npm run lint:md` → 依慣例提交。
- 新增 agent prompt：在 `docs/guide/prompts/` 新增 `.prompt.md`，包含 front-matter，範例格式：

```markdown
---
mode: 'agent'
description: '針對圖片產生結構化內容的指示'
---

## 指示內容
- 以此圖片為基礎建構內容結構...
```

- 參考範例：`docs/guide/prompts/build.prompt.md`、`docs/guide/prompts/comment.prompt.md`。

## 整合點與外部相依

- 主要相依（開發時需安裝）：`vitepress`, `vitepress-plugin-llms`, `markdownlint-cli2`（見 `devDependencies`）。
- 部署：此 repo 主要產生靜態站點，部署方式依使用者環境（GitHub Pages、Netlify、Vercel 等）自由選擇；CI/CD 未在專案中強制指定。

## 編輯限制與不要做的事

- 不要在非 `docs/` 的路徑新增網站內容。
- 不要變更 `package.json` 的 lint 設定或 VitePress 腳本，除非必要並說明理由。

## 若有疑問時先檢查的檔案（閱讀優先順序）

1. `README.md`
2. `package.json`
3. `docs/guide/copilot-instructions.md`
4. `docs/guide/prompts/` 內的範例

---

請檢閱這份指引是否包含你希望 AI 代理能立即使用的資訊，或指出任何遺漏（例如特定 CI、部署或其它外部服務整合）。
