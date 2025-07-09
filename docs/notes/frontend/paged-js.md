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

## 參考資料

- [Paged.js 官方網站](https://www.pagedjs.org/)
- [Paged.js GitHub](https://github.com/pagedjs/pagedjs)
