# CSS 換行

[[toc]]

本文說明 CSS 中處理文字換行的各種屬性與技巧，提供常用的換行解決方案與程式碼範例。適合前端開發者參考使用。

## 結論

### 英文字太長自動換行（先換行再斷行）
```css
overflow-wrap: break-word;
/* tailwind */
.break-words
```
- 適用於避免英文單字過長導致版面溢出。

### 英文字太長直接斷行
```css
overflow-wrap: break-word;
word-break: break-all;
/* tailwind */
.break-words
.break-all
```
- 適用於強制英文單字在任何位置斷行。

### 禁止自動換行
```css
white-space: nowrap;
```
- 適用於單行顯示、避免自動換行。

## CSS 換行屬性說明 {#property-explain}

### overflow-wrap / word-wrap
- `overflow-wrap` 用於指定是否允許單詞內換行。
- `word-wrap` 是 `overflow-wrap` 的舊稱，語意相同。
- 常用值：
  - `normal`（預設）：使用瀏覽器預設換行規則。
  - `break-word`：允許單詞內部換行，單字過長時自動斷行。

```css
overflow-wrap: break-word;
word-wrap: break-word;
```

### word-break
- 控制單詞或字串的斷行方式。
- 常用值：
  - `normal`（預設）：標準斷行規則。
  - `break-all`：非 CJK 文本可在任意字元間斷行。

```css
word-break: break-all;
```

## 保留空白與換行 {#whitespace}
- `white-space: pre-wrap;` 可保留空白字元與換行符號。
- 搭配 `overflow-wrap: break-word;` 可避免溢出。

```css
.css {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
```
- tailwind：`whitespace-pre-wrap break-words`

## 多行截斷（tailwind 實用技巧） {#line-clamp}
- 限制顯示行數，多餘內容以省略號顯示。

```css
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
```
- tailwind：`line-clamp-1`、`line-clamp-2` ...

## 參考
- [MDN: overflow-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-wrap)
- [MDN: word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs/word-break)