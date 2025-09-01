# 安全使用 target="_blank" 的方式

本文件說明使用 `target="_blank"` 開啟新分頁時可能面臨的安全風險，並提供完整的解決方案來防止「反向標籤劫持」（Reverse Tabnabbing）攻擊，適合前端開發者了解與實作安全的外部連結。

[[toc]]

## 安全風險說明

### 什麼是反向標籤劫持攻擊

當使用 `target="_blank"` 開啟外部連結時，新開啟的頁面會獲得原始頁面的 `window.opener` 參考，這讓惡意網站有機會操控原始頁面。

**攻擊流程：**

1. 使用者點擊含有 `target="_blank"` 的連結
2. 新分頁開啟後，惡意網站取得 `window.opener` 物件
3. 惡意網站透過 `window.opener.location` 將原始頁面導向釣魚網站
4. 使用者回到原始分頁時，看到的是偽造的釣魚頁面

### 潛在風險

- **釣魚攻擊**：原始頁面被導向看似合法的釣魚網站
- **資料竊取**：使用者可能在釣魚網站輸入敏感資訊
- **信任濫用**：利用使用者對原始網站的信任進行詐騙

---

## 不安全的寫法

以下是容易受到攻擊的常見寫法：

```html
<!-- ❌ 危險：僅使用 target="_blank" -->
<a href="https://external-site.com" target="_blank">
  查看外部網站
</a>

<!-- ❌ 危險：JavaScript 開啟新視窗 -->
<button onclick="window.open('https://external-site.com')">
  開啟外部網站
</button>
```

**為什麼不安全：**

- 新開啟的頁面可以透過 `window.opener` 存取原始頁面
- 惡意網站可以執行 `window.opener.location = 'https://fake-site.com'`
- 原始頁面會在背景被重新導向到惡意網站

---

## 安全的解決方案

### 方案一：使用 rel="noopener"

這是最主要的解決方案，可以阻斷新頁面對原始頁面的存取：

```html
<!-- ✅ 安全：使用 rel="noopener" -->
<a href="https://external-site.com" target="_blank" rel="noopener">
  查看外部網站
</a>

<!-- ✅ 更安全：同時使用 noopener 和 noreferrer -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  查看外部網站
</a>
```

**屬性說明：**

- `rel="noopener"`：防止新頁面存取 `window.opener`
- `rel="noreferrer"`：不傳送 HTTP Referer 標頭，增加隱私保護

### 方案二：JavaScript 安全開啟新視窗

當需要用 JavaScript 開啟新視窗時，確保清除 `opener` 參考：

```javascript
// ✅ 安全的 JavaScript 寫法
function openSafeWindow(url) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  
  // 額外保護：手動清除 opener 參考
  if (newWindow) {
    newWindow.opener = null
  }
}

// 使用範例
document.getElementById('external-link').addEventListener('click', function(e) {
  e.preventDefault()
  openSafeWindow('https://external-site.com')
})
```

### 方案三：動態生成安全連結

針對動態生成的連結，確保加上安全屬性：

```javascript
// ✅ 動態生成安全連結
function createSafeExternalLink(url, text) {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = text
  return link
}

// 使用範例
const safeLink = createSafeExternalLink('https://external-site.com', '安全的外部連結')
document.body.appendChild(safeLink)
```

---

## 瀏覽器支援情況

### rel="noopener" 支援度

- **Chrome 49+**：完整支援
- **Firefox 52+**：完整支援  
- **Safari 10.1+**：完整支援
- **Edge 79+**：完整支援

### 現代瀏覽器的預設行為

從 Chrome 88 開始，瀏覽器會自動為 `target="_blank"` 加上 `rel="noopener"` 行為，但仍建議明確寫出以確保相容性。

---

## 最佳實務建議

### 1. 統一使用安全屬性

建立標準模板，確保所有外部連結都加上安全屬性：

```html
<!-- 標準安全外部連結模板 -->
<a href="{{外部網址}}" target="_blank" rel="noopener noreferrer">
  {{連結文字}}
</a>
```

### 2. 程式化檢查

在大型專案中，可以用工具檢查是否有不安全的 `target="_blank"` 使用：

```javascript
// 檢查頁面中不安全的外部連結
function checkUnsafeExternalLinks() {
  const links = document.querySelectorAll('a[target="_blank"]')
  const unsafeLinks = []
  
  links.forEach(link => {
    const rel = link.getAttribute('rel') || ''
    if (!rel.includes('noopener')) {
      unsafeLinks.push(link)
    }
  })
  
  if (unsafeLinks.length > 0) {
    console.warn('發現不安全的外部連結：', unsafeLinks)
  }
}

// 在開發環境下執行檢查
if (process.env.NODE_ENV === 'development') {
  checkUnsafeExternalLinks()
}
```

### 3. ESLint 規則

使用 ESLint 外掛來自動檢查不安全的連結：

```json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "react/jsx-no-target-blank": "error"
  }
}
```

---

## 測試安全性

### 簡單測試方法

建立測試頁面驗證安全性實作：

```html
<!DOCTYPE html>
<html>
<head>
  <title>安全性測試</title>
</head>
<body>
  <h1>測試頁面</h1>
  
  <!-- 不安全的連結（僅用於測試） -->
  <a href="data:text/html,<script>if(window.opener){alert('不安全！可以存取 opener')}</script>" 
     target="_blank">
    測試不安全連結
  </a>
  
  <!-- 安全的連結 -->
  <a href="data:text/html,<script>if(window.opener){alert('不安全！')}else{alert('安全！無法存取 opener')}</script>" 
     target="_blank" 
     rel="noopener noreferrer">
    測試安全連結
  </a>
</body>
</html>
```

**測試步驟：**

1. 點擊測試連結
2. 安全的連結應該顯示「安全！無法存取 opener」
3. 不安全的連結會顯示警告訊息

---

## 常見問題與注意事項

### Q: 什麼時候需要使用 target="_blank"？

**適合使用的情況：**

- 開啟外部網站或文件
- 開啟下載連結
- 開啟社群媒體分享連結
- 開啟說明文件或 API 文件

**不建議使用的情況：**

- 網站內部頁面連結
- 重要的使用者流程頁面（如結帳頁面）

### Q: rel="noreferrer" 是否必要？

`rel="noreferrer"` 主要用於隱私保護，阻止傳送 HTTP Referer 標頭：

- **需要使用**：隱私敏感的應用、不希望外部網站知道來源
- **可選使用**：一般情況下，`rel="noopener"` 已足夠防止安全風險

### Q: 對 SEO 是否有影響？

使用 `rel="noopener noreferrer"` 對 SEO 的影響：

- **正面影響**：提升網站安全性評分
- **中性影響**：不會影響搜尋引擎對內容的理解
- **注意事項**：`rel="noreferrer"` 會阻止流量追蹤，需評估分析需求

---

## 參考資料

- [MDN - rel="noopener"](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noopener)
- [MDN - rel="noreferrer"](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noreferrer)
- [OWASP - Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing)
- [Google Web Fundamentals - External links](https://web.dev/external-anchors-use-rel-noopener/)
- [Can I use - rel=noopener](https://caniuse.com/rel-noopener)