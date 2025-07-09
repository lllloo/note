# Paged.js

這份文件說明如何在前端專案中使用 [Paged.js](https://www.pagedjs.org/) 進行分頁印刷版面設計，包含安裝、基本用法、常見設定與最佳實踐，適合需要生成 PDF 或印刷版面的前端開發參考。

[[toc]]

## 什麼是 Paged.js？

Paged.js 是一個開源的 JavaScript 函式庫，用於在瀏覽器中創建符合印刷標準的分頁媒體。它實作了 CSS Paged Media 規範，讓開發者能夠：

- **精確的分頁控制**：自動處理分頁、避免內容被截斷
- **印刷級排版**：支援頁首、頁尾、頁碼、目錄等印刷元素
- **CSS 驅動**：使用標準 CSS 語法控制版面，無需學習額外 API
- **PDF 生成**：搭配 Puppeteer 或其他工具生成高品質 PDF
- **跨瀏覽器相容**：在現代瀏覽器中提供一致的印刷預覽

## 安裝與基本設定

### 透過 CDN 引入

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
</head>
<body>
  <!-- 你的內容 -->
</body>
</html>
```

### 透過 npm 安裝

```bash
npm install pagedjs
```

```js
import { Previewer } from 'pagedjs'

// 初始化
const previewer = new Previewer()
previewer.preview()
```

## 基本用法

### 基礎分頁設定

```css
@page {
  size: A4;
  margin: 2cm;
}

/* 避免標題被分頁切斷 */
h1, h2, h3 {
  break-after: avoid;
}

/* 避免段落被切斷 */
p {
  break-inside: avoid;
}
```

### 頁首與頁尾

```css
@page {
  @top-center {
    content: "文件標題";
  }
  
  @bottom-right {
    content: "第 " counter(page) " 頁，共 " counter(pages) " 頁";
  }
}

/* 首頁不顯示頁首 */
@page:first {
  @top-center {
    content: none;
  }
}
```

### 章節分頁

```css
.chapter {
  break-before: page;
}

.section {
  break-before: avoid;
}

/* 強制在右頁開始新章節 */
.chapter {
  break-before: right;
}
```

## 進階功能

### 目錄生成

```css
/* 目錄樣式 */
.toc a::after {
  content: leader('.') target-counter(attr(href), page);
}

/* 目錄項目 */
.toc-item {
  display: flex;
  justify-content: space-between;
}
```

```html
<div class="toc">
  <div class="toc-item">
    <a href="#chapter1">第一章 簡介</a>
  </div>
  <div class="toc-item">
    <a href="#chapter2">第二章 使用方法</a>
  </div>
</div>
```

### 變數與計數器

```css
/* 自訂頁碼樣式 */
@page {
  @bottom-center {
    content: "- " counter(page) " -";
    font-style: italic;
  }
}

/* 章節計數器 */
body {
  counter-reset: chapter;
}

h1 {
  counter-increment: chapter;
}

h1::before {
  content: "第 " counter(chapter) " 章 ";
}
```

### 圖片與表格處理

```css
/* 避免圖片被切斷 */
img {
  break-inside: avoid;
  max-width: 100%;
  height: auto;
}

/* 表格分頁處理 */
table {
  break-inside: auto;
}

table tr {
  break-inside: avoid;
}

/* 重複表格標題 */
thead {
  display: table-header-group;
}
```

## 與前端框架整合

### 在 Vue.js 中使用

```js
// composables/usePaged.js
import { Previewer } from 'pagedjs'

export function usePaged() {
  const generatePDF = async (elementId = 'app') => {
    const element = document.getElementById(elementId)
    if (!element) return
    
    const previewer = new Previewer()
    await previewer.preview(element.innerHTML)
  }
  
  return {
    generatePDF
  }
}
```

### 在 React 中使用

```jsx
import { useEffect } from 'react'
import { Previewer } from 'pagedjs'

function PrintableDocument() {
  useEffect(() => {
    const previewer = new Previewer()
    previewer.preview()
  }, [])
  
  return (
    <div className="document">
      {/* 你的內容 */}
    </div>
  )
}
```

## 搭配 Puppeteer 生成 PDF

```js
const puppeteer = require('puppeteer')

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.setContent(`
    <html>
      <head>
        <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
        <style>
          @page { size: A4; margin: 2cm; }
          /* 你的 CSS 樣式 */
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `)
  
  // 等待 Paged.js 處理完成
  await page.waitForSelector('.pagedjs_pages')
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })
  
  await browser.close()
  return pdf
}
```

## 常見問題與解決方案

### 避免內容重疊

```css
/* 確保足夠的下邊距 */
@page {
  margin-bottom: 3cm;
}

/* 調整元素間距 */
p, div {
  margin-bottom: 1em;
}
```

### 處理大型表格

```css
/* 允許表格跨頁 */
.large-table {
  break-inside: auto;
}

.large-table tr {
  break-inside: avoid;
  break-after: auto;
}
```

### 自訂分頁位置

```css
/* 在特定元素前強制分頁 */
.page-break {
  break-before: page;
}

/* 防止在特定元素前分頁 */
.keep-together {
  break-before: avoid;
  break-after: avoid;
  break-inside: avoid;
}
```

## 最佳實踐

1. **測試不同瀏覽器**：確保在目標瀏覽器中顯示正確
2. **優化圖片大小**：使用適當解析度避免檔案過大
3. **預留足夠邊距**：確保重要內容不會被截斷
4. **使用語意化 HTML**：有助於無障礙存取和 SEO
5. **分離內容與樣式**：使用外部 CSS 文件便於維護

## 參考資料

- [Paged.js 官方網站](https://www.pagedjs.org/)
- [Paged.js GitHub](https://github.com/pagedjs/pagedjs)
- [CSS Paged Media Module](https://www.w3.org/TR/css-page-3/)
- [Puppeteer 官方文件](https://pptr.dev/)
- [CSS 分頁媒體指南](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Pages)