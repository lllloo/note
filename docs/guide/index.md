# 指南

本文件彙整各類指南，便於查閱與管理。
[[toc]]

## Awesome Copilot（awesome-copilot）

`awesome-copilot` 是 GitHub 上的一個精選資源清單（awesome-list），收集與 GitHub Copilot 及相關生態系有關的工具、外掛、教學、範例與實務心得。

GitHub 倉庫：[https://github.com/github/awesome-copilot](https://github.com/github/awesome-copilot)

### 指南文件

這裡的文件都是從 `awesome-copilot` 倉庫中下載過的，並經過翻譯，以便於理解與使用。

#### GitHub Copilot 自訂指令

- [instructions](./instructions.instructions)
- [prompt](./prompt.instructions)

#### 通用自訂指令

- [約束 Copilot 的提示](./taming-copilot.instructions)

#### 特定自訂指令

- [markdown](./markdown.instructions)
- [docker](./containerization-docker-best-practices.instructions)
- [vue](./vuejs3.instructions)
- [typescript](./typescript-5-es2022.instructions)
- [GitHub Actions](./github-actions-ci-cd-best-practices.instructions)

### 讓本地專案都可以一起使用

settings.json 範例：

```json
{
  "chat.instructionsFilesLocations": {
    "你的目錄/docs/guide/*.instructions.md": true
  }
}
```

請將範例中的 `你的目錄` 替換為你本機的實際專案路徑。

### 來源與授權

- 指南文件部分內容改編自 `https://github.com/github/awesome-copilot`。
- 指南文件之翻譯與改寫內容仍依 MIT 授權釋出。
- 使用或散布時，請同時保留原始作者的著作權宣告與 MIT 授權全文。

## Conventional Commits

Conventional Commits 是一套用於撰寫一致性 Commit 訊息的規範。

### 指南文件

- [conventional-commits](./conventional-commits.md)

### 來源

- 官方規範：[Conventional Commits v1.0.0](https://www.conventionalcommits.org/zh-hant/v1.0.0/)
- 建議參考官方文件以取得完整定義、範例與擴充規則。
