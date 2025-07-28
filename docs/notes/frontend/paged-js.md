# Paged.js

這份文件說明如何在前端專案中使用 [Paged.js](https://www.pagedjs.org/) 進行分頁印刷版面設計，包含安裝、基本用法、常見設定與最佳實踐，適合需要生成 PDF 或印刷版面的前端開發參考。

[[toc]]

## 安裝與基本設定

### 透過 CDN 引入

建議下載 polyfill，請造訪 [https://unpkg.com/pagedjs/dist/](https://unpkg.com/pagedjs/dist/)。
曾經遇過 cdn 引入失敗的情況，建議下載後放在本地。

```html
<script src="js/paged.polyfill.js"></script>
```

```html
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
```

## 基本用法

### 基礎分頁設定

```css
@page {
  size: A4;
  margin: 2cm;
}
```

### 頁首與頁尾

```css
@page {
  @top-center {
    content: '文件標題';
  }

  @bottom-center {
    content: '第 ' counter(page) ' 頁，共 ' counter(pages) ' 頁';
  }
}
```

## 分頁控制

### 避免元素內分頁

使用 `break-inside: avoid;` 可以防止元素在分頁時被切斷，確保內容的完整性。

```css
.no-page-break {
  break-inside: avoid;
}
```

#### 常見使用場景

```css
/* 防止表格在分頁時被切斷 */
table {
  break-inside: avoid;
}

/* 防止重要段落被分頁切斷 */
.important-section {
  break-inside: avoid;
}

/* 防止圖片與說明文字分離 */
.figure-with-caption {
  break-inside: avoid;
}
```

#### 注意事項

- 當元素內容超過一整頁時，`break-inside: avoid;` 將不會生效
- 建議搭配其他分頁控制屬性使用，如 `break-before` 和 `break-after`

## 參考資料

- [Paged.js 官方網站](https://www.pagedjs.org/)
- [Paged.js GitHub](https://github.com/pagedjs/pagedjs)
