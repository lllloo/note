# Conventional Commits 中文說明

本文件根據 [Conventional Commits v1.0.0 中文版](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 整理，供 commit message 產生器參考。

## 格式

每個 commit message 必須遵循以下格式：

```text
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

### type

- feat: 新功能
- fix: 修復 bug
- docs: 文件變更
- style: 格式（不影響程式碼運行的變動）
- refactor: 重構（既不是修復 bug 也不是新增功能的程式碼變動）
- perf: 性能優化
- test: 增加或修改測試
- build: 影響建置系統或外部相依的變動
- ci: 持續整合相關變動
- chore: 其他不修改 src 或 test 的變動
- revert: 回復先前的 commit

### scope（可選）

影響範圍，例如：parser、api、web、mobile。

### description

簡短描述本次變更內容。

### body（可選）

更詳細的變更說明。

### footer（可選）

如 BREAKING CHANGE 或關聯的 issue 編號。

## 參考

- [Conventional Commits 中文官方文件](https://www.conventionalcommits.org/zh-hant/v1.0.0/)
- [GitHub 原始文件](https://github.com/conventional-commits/conventionalcommits.org/blob/master/content/v1.0.0/index.zh-hant.md)
