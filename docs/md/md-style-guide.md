# Markdown 編排規範（AI 參考用）

本文件用於指導 AI 協助整理、編排 Markdown（.md）筆記內容，確保風格一致、條理清晰，並符合 VitePress 官方建議。

---

## 1. 標題與分段
- 使用 `#` 作為主標題，`##`、`###` 作為子標題，依內容層級遞減。
- 主題之間以 `---` 分隔，提升可讀性。
- 標題可加自訂 anchor（如 `# 標題 {#my-anchor}`）。

## 2. Frontmatter
- 支援 YAML frontmatter，建議於檔案開頭加入（如 `title`、`lang` 等）。

## 3. 目錄
- 使用 `[[toc]]` 自動生成目錄。

## 4. 指令區塊與語法高亮
- 所有指令均使用三個反引號加語言標註（如 `sh`、`ini`、`js`、`ts`、`html`）。
- 支援行號、行高亮、diff、focus、警告等標註（詳見 VitePress 文件）。
- 可用 `<<< @/filepath` 匯入程式碼片段。
- 可用 `::: code-group` 群組多個程式碼區塊。

## 5. 說明與註解
- 每個指令區塊下方，簡要說明用途、適用情境。
- 若有多個選項，使用無序清單（-）條列。

## 6. 超連結
- 內部連結自動轉為 SPA router link，建議省略副檔名。
- 外部連結自動加上 `target="_blank" rel="noreferrer"`。
- 相關標準、外部資源以 `[名稱](網址)` 格式附於段落中。

## 7. 表格與 Emoji
- 支援 GitHub 風格表格與 emoji 語法（如 `:tada:`）。

## 8. 自訂提示區塊
- 使用 `::: info|tip|warning|danger|details` 建立提示區塊。
- 支援自訂標題與屬性。
- 支援 GitHub-flavored Alerts（如 `> [!NOTE]`）。

## 9. Markdown 檔案引用
- 可用 `<!--@include: ./path/file.md#anchor{行範圍}-->` 引用其他 md 檔案內容。

## 10. 數學公式
- 支援 LaTeX 語法，需安裝 `markdown-it-mathjax3` 並於 config 啟用。

## 11. 其他注意事項
- 保持語句簡潔。
- 內容分段明確。
- 指令與說明分離。
- 支援內嵌 HTML。
- 圖片可啟用 lazy loading。

---

## 範例

---

---

---

# 主題標題

---

## 子標題
```sh
指令內容
```
- 指令說明

---

## 另一主題
[外部連結說明](https://example.com)

---

## 條列說明
- 選項一：說明
- 選項二：說明

---

::: tip 自訂提示
這是自訂提示區塊。
:::

---

[[toc]]

---

| 標題1 | 標題2 |
| ------ | ------ |
| 內容A  | 內容B  |

---

:100: :tada:

---

AI 協助時，請依本規範與 VitePress 官方[Markdown 指南](https://vitepress.dev/guide/markdown)自動調整、補充、分段與排版。
