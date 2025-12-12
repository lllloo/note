# JSDoc 與 TypeScript 型別註解範例

JSDoc 可用於 JavaScript/TypeScript 進行型別註解，提升編輯器提示與型別安全。

[[toc]]

## @type

### 範例

```js
/**
 * @type {string}
 */
var s

/** @type {Window} */
var win

/** @type {PromiseLike<string>} */
var promisedString

// 你可以使用 DOM 屬性指定 HTML 元素
/** @type {HTMLElement} */
var myElement = document.querySelector(selector)
```

### 型別轉換 (Casts)

TypeScript 借用自 Google Closure 的型別轉換語法，可以在任何括號運算式前加上 `@type` 標籤來進行型別轉換。

```js
var numberOrString = Math.random() < 0.5 ? 'hello' : 100
var typeAssertedNumber = /** @type {number} */ (numberOrString)
```

你甚至可以像 TypeScript 一樣轉型為 const：

```js
let one = /** @type {const} */ (1)
```

## @param and @returns

### 範例

```js
/**
 * 加總兩個數字
 * @param {number} a 第一個數字
 * @param {number} b 第二個數字
 * @returns {number} 相加結果
 */
function add(a, b) {
  return a + b
}
```

## @typedef

### 範例

`@typedef` 用於定義複雜型別或物件型別，方便在多處重複使用型別註解。

範例：

```js
/**
 * @typedef {Object} User
 * @property {string} name 使用者名稱
 * @property {number} age 年齡
 */

/**
 * @type {User}
 */
const user = {
  name: 'Alice',
  age: 30,
}
```

## 參考資料

- [TypeScript 官方 JSDoc 型別文件](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
