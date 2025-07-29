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

### 避免元素被分頁切斷

`break-inside: avoid;` 是分頁排版最常用的屬性之一，可以防止元素在分頁時被切斷，確保內容完整，常用於表格、圖片、段落等。

範例：

```css
.break-inside-avoid {
  break-inside: avoid;
}
```

### 分頁斷點控制

分頁時可用以下 CSS 屬性控制元素的分頁行為：

- `break-before: always;` 強制元素前方分頁，常用於章節或標題。
- `break-after: always;` 強制元素後方分頁，常用於段落或圖片。

範例：

```css
.break-before-always {
  break-before: always;
}

.break-after-always {
  break-after: always;
}
```

## 參考資料

- [Paged.js 官方網站](https://www.pagedjs.org/)
- [Paged.js GitHub](https://github.com/pagedjs/pagedjs)
