---
applyTo: '**/*.instructions.md'
description: '建立高品質自訂指引檔以指導 GitHub Copilot 的準則'
---

# 自訂指引檔準則

建立有效且易於維護的自訂指引檔，指導 GitHub Copilot 生成領域專屬程式碼並遵循專案慣例。

## 專案背景

- 目標讀者：與領域程式碼互動的開發者與 GitHub Copilot
- 檔案格式：帶 YAML frontmatter 的 Markdown
- 檔名慣例：小寫、以連字號分隔（例如 `react-best-practices.instructions.md`）
- 存放位置：`.github/instructions/` 目錄
- 目的：提供具情境的指引以協助程式碼生成、審查與文件撰寫

## 必要的 Frontmatter

每個指引檔必須包含下列欄位的 YAML frontmatter：

```yaml
---
description: '指引用途與範圍的簡短說明'
applyTo: '適用檔案的 glob pattern（例如 **/*.ts、**/*.py）'
---
```

### Frontmatter 指引

- **description**：單引號字串，1-500 字，清楚說明用途
- **applyTo**：指定此指引適用之檔案的 Glob pattern(s)
  - 單一 pattern：`'**/*.ts'`
  - 多個 pattern：`'**/*.ts, **/*.tsx, **/*.js'`
  - 指定檔案：`'src/**/*.py'`
  - 全部檔案：`'**'`

## 檔案構成

良好結構的指引檔應包含下列章節：

### 1. 標題與總覽

- 使用 `#` 標題，清楚且具描述性的標題
- 簡短介紹，說明目的與適用範圍
- 選用：列出專案上下文（關鍵技術與版本）

### 2. 核心章節

依領域將內容組織為邏輯章節：

- **General Instructions**：高階指導原則
- **Best Practices**：建議的範式與做法
- **Code Standards**：命名慣例、格式化、樣式規則
- **Architecture/Structure**：專案組織與設計模式
- **Common Patterns**：常見實作範例
- **Security**：安全性考量（如適用）
- **Performance**：優化指引（如適用）
- **Testing**：測試標準與方法（如適用）

### 3. 範例與程式碼片段

提供具體範例並標明清楚標籤：

````markdown
### 良好範例

```language
// 建議的方法
code example here
```
````

### 不良範例

```language
// 避免此模式
code example here
```

````

### 4. 驗證與確認（可選但建議）

- 建構（Build）指令以驗證程式
- Lint 與格式化工具
- 測試需求
- 驗證步驟

## 內容撰寫指引

### 撰寫風格

- 使用清晰且扼要的語句
- 以祈使句撰寫（"Use", "Implement", "Avoid"）
- 具體且可執行
- 避免模糊用語，如 "should"、"might"、"possibly"
- 使用清單與要點以提高可讀性
- 保持章節重點明確且易於掃描

### 最佳實務

- **Be Specific**：提供具體範例，避免抽象說明
- **Show Why**：當能增加價值時解釋建議的理由
- **Use Tables**：比較選項或列規則時使用表格
- **Include Examples**：真實程式碼範例比純文字描述更有效
- **Stay Current**：參考當前版本與實務
- **Link Resources**：引用官方文件與權威資源

### 建議包含的常見模式

1. **命名慣例**：變數、函式、類別、檔案的命名方式
2. **程式碼組織**：檔案結構、模組組織、import 順序
3. **錯誤處理**：偏好的錯誤處理模式
4. **相依性管理**：如何管理與記錄相依性
5. **註解與文件**：何時以及如何撰寫註解或文件
6. **版本資訊**：目標語言/框架版本資訊

## 推薦範式

### 要點與清單

```markdown
## 安全性最佳實務

- 始終在處理前驗證使用者輸入
- 使用參數化查詢以防止 SQL 注入
- 將機密儲存在環境變數中，切勿寫在程式碼中
- 實作適當的認證與授權機制
- 在生產環境啟用 HTTPS
````

### 用於結構化資訊的表格

```markdown
## 常見問題

| Issue            | Solution            | Example                       |
| ---------------- | ------------------- | ----------------------------- |
| Magic numbers    | Use named constants | `const MAX_RETRIES = 3`       |
| Deep nesting     | Extract functions   | Refactor nested if statements |
| Hardcoded values | Use configuration   | Store API URLs in config      |
```

### 程式碼比較示例

````markdown
### 良好範例 - 使用 TypeScript 介面

```typescript
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): User {
  // 實作內容
}
```
````

### 不良範例 - 使用 any 類型

```typescript
function getUser(id: any): any {
  // 失去型別安全
}
```

````

### 條件式建議

```markdown
## 框架選擇

- **小型專案**：使用 Minimal API 方法
- **大型專案**：採用 controller-based 架構，並明確分層
- **微服務**：考慮採用領域驅動設計（DDD）
````

## 應避免的模式

- **過度冗長的說明**：保持簡潔且易於掃描
- **過時資訊**：務必參考最新版本與實務
- **模糊不清的指引**：明確指出應做或應避免的事項
- **缺乏範例**：避免僅有抽象規則而無具體程式範例
- **互相矛盾的建議**：確保檔案內部一致性
- **直接複製官方文件**：透過整理與在地化提供額外價值

## 測試指引檔

在完成指引檔前：

1. **在 Copilot 測試**：在 VS Code 中使用實際 prompt 驗證指引效果
2. **驗證範例**：確認程式範例正確且可執行
3. **檢查 Glob pattern**：驗證 `applyTo` 的 glob pattern 是否匹配預期檔案

## 範例結構

下方為建立新指引檔的最小範例結構：

````markdown
---
description: '用途的簡短說明'
applyTo: '**/*.ext'
---

# 技術名稱 開發指南

簡短介紹與背景。

## General Instructions

- 高階指導要點 1
- 高階指導要點 2

## Best Practices

- 具體做法 1
- 具體做法 2

## Code Standards

### 命名慣例

- 規則 1
- 規則 2

### 檔案組織

- 結構 1
- 結構 2

## 常見模式

### Pattern 1

描述與範例

```language
code example
```
````

### Pattern 2

描述與範例

## 驗證

- 建構指令：`command to verify`
- Lint 指令：`command to lint`
- 測試指令：`command to test`

```

## Maintenance

- 在相依性或框架更新時檢視並更新指引
- 更新範例以反映當前最佳實務
- 移除過時的模式或已棄用的功能
- 隨社群新興模式新增相關內容
- 隨專案結構演進維護 glob pattern 的正確性

## Additional Resources

- [Custom Instructions Documentation](https://code.visualstudio.com/docs/copilot/customization/custom_instructions)
- [Awesome Copilot Instructions](https://github.com/github/awesome-copilot/tree/main/instructions)
```
