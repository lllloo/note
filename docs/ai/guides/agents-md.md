# AGENTS.md：AI 編碼工具的統一指令標準

不同 AI 工具各自有自己的指令檔，`CLAUDE.md`、`.github/copilot-instructions.md`、`CURSOR_RULES` 等，讓維護多份內容變得麻煩。`AGENTS.md` 是一個跨工具的開放標準，目標是讓所有 AI 編碼工具讀取同一份指令。

[[toc]]

## 各工具支援現況

| 工具 | 支援 AGENTS.md | 說明 |
|---|---|---|
| Claude Code | ❌ | 僅讀 `CLAUDE.md`，社群 Feature Request [#6235](https://github.com/anthropics/claude-code/issues/6235) 中 |
| GitHub Copilot | ✅ | GA，預設開啟（`chat.useAgentsMdFile: true`） |
| GitHub Copilot CLI | ✅ | 原生支援 |
| Cursor | ✅ | 原生支援 |
| OpenCode | ✅ | 原生支援 |

## 用 Claude Code 產生 CLAUDE.md

在專案根目錄執行 Claude Code，使用 `/init` 指令讓它自動分析專案並產生 `CLAUDE.md`：

```bash
claude
```

```
/init
```

Claude Code 會掃描專案結構、`package.json`、設定檔等，產生符合專案實際情況的 `CLAUDE.md`。

## 因應方案

既然 Claude Code 尚未原生支援 `AGENTS.md`，社群整理出幾種實用做法：

### 方案一：`@` 引用

在 `CLAUDE.md` 加入 `@AGENTS.md`，Claude Code 啟動時會自動讀入 `AGENTS.md` 的內容。

**純轉接**：把所有指令遷移到 `AGENTS.md`，`CLAUDE.md` 只留一行：

```markdown
@AGENTS.md
```

```
AGENTS.md     ← 所有指令都在這裡（其他工具直接讀取）
CLAUDE.md     ← 只有一行 @AGENTS.md，Claude Code 讀到的內容等同 AGENTS.md
```

**混合模式**：共用內容放 `AGENTS.md`，Claude Code 專屬指令另外補在後面：

```markdown
@AGENTS.md

## Claude Code 專屬設定
...Claude Code 特有的指令...
```

**優點**：`AGENTS.md` 成為各工具的共用來源；混合模式可在不影響其他工具的情況下保留 Claude Code 專屬設定；未來 Claude Code 若原生支援 `AGENTS.md`，直接移除 `CLAUDE.md` 即可。此方案在 [Issue #6235](https://github.com/anthropics/claude-code/issues/6235) 獲得最多社群認同（293+ 👍）。

**缺點**：仍需維護兩個檔案；`@` 引用依賴 Claude Code 的解析實作，若版本更新改變行為可能失效。

### 方案二：Symlink（推薦）

建立 Symlink 讓兩個檔案指向同一份內容，依照你的起點選擇方向：

| 情境 | 主檔 | Symlink |
|---|---|---|
| 新專案，以 AGENTS.md 為主 | `AGENTS.md` | `CLAUDE.md → AGENTS.md` |
| 既有 CLAUDE.md，不想改動 | `CLAUDE.md` | `AGENTS.md → CLAUDE.md` |

#### macOS / Linux

```bash
# 以 AGENTS.md 為主
ln -s AGENTS.md CLAUDE.md

# 以 CLAUDE.md 為主
ln -s CLAUDE.md AGENTS.md
```

#### Windows PowerShell

```powershell
# 以 AGENTS.md 為主
New-Item -ItemType SymbolicLink -Path "CLAUDE.md" -Target "AGENTS.md"

# 以 CLAUDE.md 為主
New-Item -ItemType SymbolicLink -Path "AGENTS.md" -Target "CLAUDE.md"
```

#### 驗證

```bash
# macOS / Linux
ls -l AGENTS.md CLAUDE.md

# Windows
Get-Item "AGENTS.md", "CLAUDE.md" | Select-Object Name, LinkType, Target
```

> 詳細的 Symlink 操作說明可參考 [符號連結建立指令](./symbolic-link)。

**優點**：只維護一個檔案，兩個工具讀到完全相同的內容。

**缺點**：Windows 需要管理員權限或開發者模式；CI/CD、ZIP 壓縮或跨平台協作時 Symlink 可能失效或被展開，導致其中一個工具讀不到內容。

## GitHub Copilot 相關設定

Copilot Chat 的 `AGENTS.md` 支援已是 GA，**預設開啟，不需要額外設定**。

VS Code 提供兩個相關設定：

```json
{
  // 是否讀取工作區根目錄的 AGENTS.md（GA，預設 true）
  "chat.useAgentsMdFile": true,

  // 是否讀取子目錄的 AGENTS.md，適合 monorepo（實驗性，預設 false）
  "chat.useNestedAgentsMdFiles": false
}
```


## 完整設定架構

以下是同時使用 Claude Code、GitHub Copilot 和 Copilot CLI 的**推薦配置**（方案二，以 AGENTS.md 為主）：

```
專案根目錄/
├── AGENTS.md     ← 主要指令檔（維護這裡）
└── CLAUDE.md     → 符號連結，指向 AGENTS.md
```

- **`AGENTS.md`**：唯一維護對象，對所有支援的工具直接生效
- **`CLAUDE.md`**：Symlink，讓 Claude Code 讀到相同內容，不需額外維護

## 未來展望

當 Claude Code 正式支援 `AGENTS.md` 後（Feature Request [#6235](https://github.com/anthropics/claude-code/issues/6235)），可直接以 `AGENTS.md` 為主，屆時 Symlink 的方向可以對調，或直接移除 `CLAUDE.md`。

## 參考資源

- [AGENTS.md 官方網站](https://agents.md/)
- [AGENTS.md GitHub](https://github.com/agentsmd/agents.md)
- [Claude Code Feature Request #6235](https://github.com/anthropics/claude-code/issues/6235)
- [符號連結建立指令](./symbolic-link)
