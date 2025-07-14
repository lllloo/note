# input 只能輸入數字且小數點最多兩位

這份文件說明如何在前端限制 `<input>` 欄位只能輸入數字，並且小數點後最多兩位，適用於表單驗證與資料輸入場景。

[[toc]]

## 使用 JavaScript 驗證（最推薦，僅輸入時即時限制）

```html
<input id="numInput" type="text" inputmode="decimal" />
<script>
  document.getElementById('numInput').addEventListener('input', function (e) {
    e.target.value = formatDecimal(e.target.value)
  })

  const formatDecimal = (value: string) => {
    return value
      .replace(/[^\d.-]/g, '')
      .replace(/(?!^)-/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/^(-?\d*\.\d{0,2}).*$/, '$1')
      .replace(/^(-?)0+(\d)/, '$1$2')
  }
</script>
```

- 這個驗證邏輯是綁定在 input 事件上，代表每次使用者輸入時（包含貼上、刪除、輸入新字元等），都會即時套用格式化，確保欄位內容始終符合規則。

## 其他可行方法

### 1. 使用 pattern 屬性（僅前端驗證）

```html
<input type="text" pattern="^-?\\d*(\\.\\d{0,2})?$" inputmode="decimal" />
```

- 這種方式僅在表單送出時驗證，無法即時限制輸入，也無法防止貼上不符格式的內容。

### 2. 使用 type="number" 搭配 step、min、max

```html
<input type="number" step="0.01" min="0" max="999999" />
```

- 這種方式可限制小數點位數，但不同瀏覽器行為不一致，且仍可輸入不符格式的內容。

### 3. 使用第三方套件

- 例如 cleave-zen (Cleave.js) 等，可快速套用格式化規則，適合複雜需求。

## 其他注意事項

- 行動裝置建議加 `inputmode="decimal"`，提升輸入體驗。

## 參考資料

- [cleave-zen 官方文件](https://github.com/nosir/cleave-zen)
