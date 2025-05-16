# Markdown 編排規範（AI 參考用） {#markdown-style-guide}

本文件說明如何編寫、整理 Markdown 筆記，並提供具體範例與注意事項，適用於 VitePress 文件編輯。

---

## 標題與分段 {#heading-and-section}
- 使用 `#` 作為主標題，`##`、`###` 作為子標題，依內容層級遞減。
- 主題之間以 `---` 分隔，提升可讀性。
- 標題可加自訂 anchor（如 `# 標題 {#my-anchor}`）。

```markdown
# 主標題 {#main-title}

---

## 子標題 {#sub-title}
```
- 標題層級錯誤會影響目錄與 SEO。

---

## 目錄自動生成 {#toc}
- 使用 `[[toc]]` 插入目錄。
- 目錄會根據標題自動生成。

```markdown
[[toc]]
```
- 目錄建議放在主標題下方。

---

## 指令區塊與語法高亮 {#code-blocks}
- 指令區塊使用三個反引號加語言標註（如 `sh`、`js`）。
- 支援行號、行高亮、diff、focus、警告等標註。
- 可用 `<<< @/filepath` 匯入程式碼片段。
- 可用 `::: code-group` 群組多個程式碼區塊。

```sh
npm install vitepress
```
- 安裝 VitePress 套件

::: code-group
```js [index.js]
console.log('Hello')
```
```ts [index.ts]
console.log('Hello')
```
:::

---

## 指令說明與註解 {#code-comment}
- 每個指令區塊下方，簡要說明用途、適用情境。
- 多個選項時，使用無序清單條列。

```sh
npm run docs:build
```
- 建立文件靜態檔案

- `npm run docs:preview`：本地預覽
- `npm run docs:dev`：開發模式

---

## 超連結規範 {#links}
- 內部連結省略副檔名，自動轉為 SPA router link。
- 外部連結加 `target="_blank" rel="noreferrer"`。
- 標準、外部資源以 `[名稱](網址)` 格式附於段落。

```markdown
[官方文件](/guide/markdown)
[Markdown 指南](https://vitepress.dev/guide/markdown)
```

---

## 表格與 Emoji {#table-emoji}
- 支援 GitHub 風格表格與 emoji 語法。

| 指令    | 說明 |
| ------- | ---- |
| install | 安裝 |
| build   | 建立 |

:100: :tada:

---

## 自訂提示區塊 {#custom-blocks}
- 使用 `::: info|tip|warning|danger|details` 建立提示區塊。
- 支援自訂標題與屬性。
- 支援 GitHub-flavored Alerts（如 `> [!NOTE]`）。

::: tip 實用技巧
可用於強調重點、警告或補充說明。
:::

> [!NOTE]
> 這是 GitHub 樣式提示。

---

## Markdown 檔案引用 {#md-include}
- 可用 `<!--@include: ./path/file.md#anchor{行範圍}-->` 引用其他 md 檔案內容。

```markdown
<!--@include: ./public/deploy.md#platform-guides{10-30}-->
```
- 適合重複內容共用。

---

## 其他注意事項 {#other}
- 保持語句簡潔，內容分段明確。
- 指令與說明分離。
- 支援內嵌 HTML。
- 圖片可啟用 lazy loading。

---

AI 協助時，請依本規範與 VitePress 官方[Markdown 指南](https://vitepress.dev/guide/markdown)自動調整、補充、分段與排版。
