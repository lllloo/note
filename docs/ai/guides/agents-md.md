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

## 以 CLAUDE.md 為主的策略

既然 Claude Code 尚未支援 `AGENTS.md`，最務實的做法是：

**以 `CLAUDE.md` 作為單一來源，`AGENTS.md` 透過 Symlink 指向它。**

```
CLAUDE.md          ← 實際內容在這裡
AGENTS.md          → 符號連結，指向 CLAUDE.md
```

這樣的好處：

- Claude Code 讀 `CLAUDE.md` → 正常運作
- 支援 `AGENTS.md` 的工具（Copilot CLI、Cursor 等）→ 透過 Symlink 讀到相同內容
- 只需維護一份檔案

## 建立 Symlink

### macOS / Linux

```bash
ln -s CLAUDE.md AGENTS.md
```

### Windows PowerShell

```powershell
New-Item -ItemType SymbolicLink -Path "AGENTS.md" -Target "CLAUDE.md"
```

### 驗證

```bash
# macOS / Linux
ls -l AGENTS.md
# 輸出範例：AGENTS.md -> CLAUDE.md

# Windows
Get-Item "AGENTS.md" | Select-Object LinkType, Target
```

> 詳細的 Symlink 操作說明可參考 [符號連結建立指令](./symbolic-link)。

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

以下是同時使用 Claude Code、GitHub Copilot 和 Copilot CLI 的建議配置：

```
專案根目錄/
├── CLAUDE.md     ← 主要指令檔（維護這裡）
└── AGENTS.md     → symlink → CLAUDE.md
```

- **`CLAUDE.md`**：主要維護對象，包含所有專案指令
- **`AGENTS.md`**：Symlink，讓其他支援的工具自動套用相同指令

## 未來展望

當 Claude Code 正式支援 `AGENTS.md` 後（Feature Request [#6235](https://github.com/anthropics/claude-code/issues/6235)），可直接以 `AGENTS.md` 為主，屆時 Symlink 的方向可以對調，或直接移除 `CLAUDE.md`。

## 參考資源

- [AGENTS.md 官方網站](https://agents.md/)
- [AGENTS.md GitHub](https://github.com/agentsmd/agents.md)
- [Claude Code Feature Request #6235](https://github.com/anthropics/claude-code/issues/6235)
- [符號連結建立指令](./symbolic-link)
