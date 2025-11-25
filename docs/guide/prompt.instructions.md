---
applyTo: '**/*.prompt.md'
description: '為 GitHub Copilot 建立高品質 prompt 檔案的指南'
---

# Copilot Prompt 檔案指南

指引說明：建立有效且可維護的 prompt 檔案，以指導 GitHub Copilot 在任一版本庫中提供一致且高品質的結果。

## 範圍與原則
- 目標讀者：為 Copilot Chat 撰寫可重用 prompt 的維護者與貢獻者。
- 目標：行為可預期、期望清晰、權限最小化，且可跨版本庫移植。
- 主要參考：VS Code 關於 prompt 檔案的文件，以及組織內的慣例。

## Frontmatter 要求
- 包含 `description`（一句話、可執行的結果）、`mode`（明確選擇 `ask`、`edit` 或 `agent`）以及 `tools`（完成 prompt 所需的最小工具集合）。
- 當 prompt 依賴特定能力等級時，請宣告 `model`；否則繼承當前的模型設定。
- 保留組織所需的任何額外 metadata（如 `language`、`tags`、`visibility` 等）。
- 使用一致的引號（建議使用單引號），並將每個欄位放在獨立一行，以利可讀性與版本控制差異檢視。

## 檔名與放置位置
- 使用 kebab-case 檔名並以 `.prompt.md` 結尾，將其存放於 `.github/prompts/`（除非工作區標準指定其他目錄）。
- 提供能表達動作的短檔名（例如使用 `generate-readme.prompt.md`，而非 `prompt1.prompt.md`）。

## 內容架構
- 以與 prompt 意圖相符的 `#` 級標題開始，方便在 Quick Pick 搜尋中顯示。
- 使用可預期的章節來組織內容。建議基線章節：`Mission` 或 `Primary Directive`、`Scope & Preconditions`、`Inputs`、`Workflow`（步驟式）、`Output Expectations` 以及 `Quality Assurance`。
- 可依領域調整章節名稱，但請保留邏輯流程：原因 → 背景 → 輸入 → 行動 → 輸出 → 驗證。
- 使用相對連結參考相關 prompt 或指引檔，增進可被發現性。

## 輸入與上下文處理
- 對於必填值使用 `${input:variableName[:placeholder]}` 並說明何時使用者需提供該值；在可能情況下提供預設值或替代方案。
- 僅在必要時呼叫上下文變數（如 `${selection}`、`${file}`、`${workspaceFolder}`），並描述 Copilot 應如何解讀這些變數。
- 記錄在必要上下文缺失時的處理方式（例如："請求檔案路徑，若仍未定義則停止"）。

## 工具與權限指引
- 將 `tools` 限縮為完成任務所需的最小集合；當順序重要時，按優先執行順序列出。
- 若 prompt 從 chat 模式繼承工具，請說明該關係並註明任何關鍵工具行為或副作用。
- 對於具破壞性的操作（建立檔案、編輯、終端命令）提供警示，並在工作流程中加入保護措施或確認步驟。

## 指示語氣與風格
- 以直接、祈使句撰寫，針對 Copilot（例如："Analyze"、"Generate"、"Summarize"）。
- 保持句子短且明確，遵循 Google 開發文件的翻譯最佳實務以支援在地化。
- 避免用慣用語、幽默或具文化特定性的參照；優先使用中性且具包容性的語言。

## 輸出定義
- 指定預期結果的格式、結構與儲存位置（例如：「使用下列範本建立 `docs/adr/adr-XXXX.md`」）。
- 包含成功準則與失敗觸發條件，讓 Copilot 知道何時停止或重新嘗試。
- 提供驗證步驟──手動檢查、自動化命令或接受準則清單，供審查者在執行 prompt 後驗證。

## 範例與可重用資產
- 嵌入良/不良範例或骨架範本（Markdown 範本、JSON 範例），說明 prompt 應產出或遵循的內容。
- 將參考表（能力、狀態碼、角色描述等）內嵌以保持 prompt 的自包含性；當上游資源變動時務必更新這些表格。
- 連結至權威文件，而非重複冗長的說明。

## 品質保證檢查清單
- [ ] Frontmatter 欄位完整、正確且遵循最小權限原則。
- [ ] 輸入包含佔位符、預設行為與 fallback 機制。
- [ ] 工作流程涵蓋準備、執行與後處理，無遺漏。
- [ ] 輸出期望包含格式與儲存細節。
- [ ] 驗證步驟具可執行性（命令、差異檢查、審查提示）。
- [ ] prompt 所引用的安全性、合規及隱私政策為最新版本。
- [ ] 在 VS Code 中使用代表性情境執行 `Chat: Run Prompt` 時，prompt 能成功執行。

## 維護指引
- 與受其影響的程式碼一同進行版本控制；當相依性、工具或審查流程變更時更新 prompt。
- 定期檢視 prompt，以確保工具清單、模型需求與連結文件仍然有效。
- 與其他版本庫協調：當某個 prompt 證明具有廣泛用途時，將共通指引抽出成指引檔或共用 prompt 套件。

## 參考資源
- [Prompt Files Documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files#_prompt-file-format)
- [Awesome Copilot Prompt Files](https://github.com/github/awesome-copilot/tree/main/prompts)
- [Tool Configuration](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools)
