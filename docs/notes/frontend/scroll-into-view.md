# scrollIntoView 滾動到元素

這份文件說明如何使用 JavaScript 的 `scrollIntoView()` 方法來滾動頁面至指定的元素位置，適用於需要實作頁面導航、錨點跳轉或改善使用者體驗的場景。

[[toc]]

## 基本用法

`scrollIntoView()` 是所有 DOM 元素都具備的原生方法，可以讓瀏覽器滾動到該元素的位置。

```javascript
// 取得目標元素
const element = document.getElementById('target-element')

// 滾動到元素
element.scrollIntoView()
```

### 簡單範例

```html
<button onclick="scrollToSection()">滾動到第三章</button>

<div style="height: 1000px;">內容區域</div>

<h2 id="chapter3">第三章</h2>
<p>這是第三章的內容...</p>

<script>
function scrollToSection() {
  document.getElementById('chapter3').scrollIntoView()
}
</script>
```

---

## 進階選項

`scrollIntoView()` 可以接受一個選項物件來控制滾動行為：

```javascript
element.scrollIntoView({
  behavior: 'smooth',    // 滾動動畫：'auto' | 'smooth'
  block: 'start',        // 垂直對齊：'start' | 'center' | 'end' | 'nearest'
  inline: 'nearest'      // 水平對齊：'start' | 'center' | 'end' | 'nearest'
})
```

### 選項說明

| 屬性       | 預設值      | 說明                           |
| ---------- | ----------- | ------------------------------ |
| `behavior` | `'auto'`    | 滾動動畫效果                   |
| `block`    | `'start'`   | 元素在視窗中的垂直位置         |
| `inline`   | `'nearest'` | 元素在視窗中的水平位置         |

---

## 常用範例

### 1. 平滑滾動到頂部

```javascript
// 滾動到元素頂部並對齊視窗頂部
element.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'start' 
})
```

### 2. 滾動到元素中央

```javascript
// 讓元素出現在視窗中央
element.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'center' 
})
```

### 3. 最小滾動距離

```javascript
// 只有在元素不可見時才滾動
element.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'nearest' 
})
```

### 4. 目錄導航範例

```html
<nav>
  <ul>
    <li><a href="#" onclick="scrollToSection('intro')">簡介</a></li>
    <li><a href="#" onclick="scrollToSection('features')">功能</a></li>
    <li><a href="#" onclick="scrollToSection('contact')">聯絡</a></li>
  </ul>
</nav>

<section id="intro">
  <h2>簡介</h2>
  <p>內容...</p>
</section>

<section id="features">
  <h2>功能</h2>
  <p>內容...</p>
</section>

<section id="contact">
  <h2>聯絡</h2>
  <p>內容...</p>
</section>

<script>
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}
</script>
```

---

## 瀏覽器相容性

### 基本支援

`scrollIntoView()` 基本功能在所有現代瀏覽器都有支援。

### 選項物件支援

| 瀏覽器   | 支援版本 |
| -------- | -------- |
| Chrome   | 61+      |
| Firefox  | 36+      |
| Safari   | 14+      |
| Edge     | 79+      |

### 相容性處理

對於較舊的瀏覽器，可以使用 polyfill 或降級處理：

```javascript
function smoothScrollTo(element) {
  // 檢查是否支援 smooth 滾動
  if ('scrollBehavior' in document.documentElement.style) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else {
    // 降級處理：使用傳統滾動
    element.scrollIntoView()
  }
}
```

---

## 注意事項

### 1. 固定標頭偏移

當頁面有固定標頭時，可能需要額外的偏移計算：

```javascript
function scrollWithOffset(element, offset = 80) {
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}
```

### 2. 性能考量

- 避免在短時間內重複呼叫 `scrollIntoView()`
- 大量元素同時滾動可能影響效能

### 3. 使用者體驗

- 提供視覺回饋讓使用者知道滾動正在進行
- 考慮是否需要可以中斷的滾動動畫

```javascript
// 滾動時顯示載入提示
function scrollWithFeedback(element) {
  const loadingIndicator = document.getElementById('loading')
  loadingIndicator.style.display = 'block'
  
  element.scrollIntoView({ behavior: 'smooth' })
  
  // 滾動完成後隱藏提示（概估時間）
  setTimeout(() => {
    loadingIndicator.style.display = 'none'
  }, 1000)
}
```

---

## 替代方案

### 1. 使用 CSS scroll-behavior

```css
html {
  scroll-behavior: smooth;
}
```

然後使用簡單的錨點連結：

```html
<a href="#section1">跳到第一節</a>
<section id="section1">內容...</section>
```

### 2. 第三方函式庫

- **smooth-scroll**: 輕量級平滑滾動函式庫
- **aos (Animate On Scroll)**: 提供滾動動畫效果

---

## 參考資料

- [MDN - Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
- [MDN - CSS scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)
- [Can I Use - scrollIntoView](https://caniuse.com/scrollintoview)
- [WHATWG - scrollIntoView specification](https://html.spec.whatwg.org/multipage/interaction.html#dom-element-scrollintoview)