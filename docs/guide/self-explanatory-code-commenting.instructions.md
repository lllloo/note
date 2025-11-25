---
applyTo: '**'
description: '為 GitHub Copilot 提供的註解指南，旨在以較少註解達成自我說明的程式碼。範例為 JavaScript，但此方法應適用於任何有註解語法的程式語言。'
---

# 自我說明的程式碼註解指引

## 核心原則

**撰寫能自行說明的程式碼。只在必要時撰寫註解來說明為何（WHY），而非說明做了什麼（WHAT）。**
大多數情況下不需要註解。

## 註解撰寫指南

### ❌ 避免以下註解類型

**明顯的註解**

```javascript
// Bad: States the obvious
let counter = 0 // Initialize counter to zero
counter++ // Increment counter by one
```

**冗贅的註解**

```javascript
// Bad: Comment repeats the code
function getUserName() {
  return user.name // Return the user's name
}
```

**過時的註解**

```javascript
// Bad: Comment doesn't match the code
// Calculate tax at 5% rate
const tax = price * 0.08 // Actually 8%
```

### ✅ 應撰寫的註解類型

**複雜的商業邏輯**

```javascript
// Good: Explains WHY this specific calculation
// Apply progressive tax brackets: 10% up to 10k, 20% above
const tax = calculateProgressiveTax(income, [0.1, 0.2], [10000])
```

**不直觀的演算法**

```javascript
// Good: Explains the algorithm choice
// Using Floyd-Warshall for all-pairs shortest paths
// because we need distances between all nodes
for (let k = 0; k < vertices; k++) {
  for (let i = 0; i < vertices; i++) {
    for (let j = 0; j < vertices; j++) {
      // ... implementation
    }
  }
}
```

**正則表達式（Regex）**

```javascript
// Good: Explains what the regex matches
// Match email format: username@domain.extension
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

**API 限制或陷阱**

```javascript
// Good: Explains external constraint
// GitHub API rate limit: 5000 requests/hour for authenticated users
await rateLimiter.wait()
const response = await fetch(githubApiUrl)
```

## 決策框架

在撰寫註解前，請問自己：

1. **程式碼是否已能自我說明？** → 不需要註解
2. **更好的變數/函式命名是否可以消除註解需求？** → 改為重構
3. **這段註解是在解釋『為何』而非『做了什麼』？** → 是：好的註解
4. **這會幫助未來的維護者嗎？** → 是：好的註解

## 註解的特殊情況

### 公開 API（Public APIs）

```javascript
/**
 * Calculate compound interest using the standard formula.
 *
 * @param {number} principal - Initial amount invested
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time period in years
 * @param {number} compoundFrequency - How many times per year interest compounds (default: 1)
 * @returns {number} Final amount after compound interest
 */
function calculateCompoundInterest(
  principal,
  rate,
  time,
  compoundFrequency = 1
) {
  // ... implementation
}
```

### 設定與常數

```javascript
// Good: Explains the source or reasoning
const MAX_RETRIES = 3 // Based on network reliability studies
const API_TIMEOUT = 5000 // AWS Lambda timeout is 15s, leaving buffer
```

### 註記（Annotations）

```javascript
// TODO: Replace with proper user authentication after security review
// FIXME: Memory leak in production - investigate connection pooling
// HACK: Workaround for bug in library v2.1.0 - remove after upgrade
// NOTE: This implementation assumes UTC timezone for all calculations
// WARNING: This function modifies the original array instead of creating a copy
// PERF: Consider caching this result if called frequently in hot path
// SECURITY: Validate input to prevent SQL injection before using in query
// BUG: Edge case failure when array is empty - needs investigation
// REFACTOR: Extract this logic into separate utility function for reusability
// DEPRECATED: Use newApiFunction() instead - this will be removed in v3.0
```

## 應避免的反模式

### 已停用程式碼的註解

```javascript
// Bad: Don't comment out code
// const oldFunction = () => { ... };
const newFunction = () => { ... };
```

### 變更紀錄註解

```javascript
// Bad: Don't maintain history in comments
// Modified by John on 2023-01-15
// Fixed bug reported by Sarah on 2023-02-03
function processData() {
  // ... implementation
}
```

### 區塊分隔註解

```javascript
// Bad: Don't use decorative comments
//=====================================
// UTILITY FUNCTIONS
//=====================================
```

## 品質檢查清單

在提交前，請確認你的註解：

- [ ] 說明為何（WHY），而不是說明做了什麼（WHAT）
- [ ] 語法正確且清晰
- [ ] 在程式碼演進後仍能保持正確
- [ ] 對於理解程式碼具有實質幫助
- [ ] 位置恰當（置於所描述程式碼之上）
- [ ] 使用正確拼字與專業用語

## 摘要

記住：**最好的註解是不需要撰寫的註解，因為程式碼本身已具備自我文件化能力。**
