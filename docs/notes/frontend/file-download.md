# 前端檔案下載

這份文件說明前端檔案下載的不同方式，包含 `<a>` 標籤下載的同網域限制，以及使用 AJAX 搭配 Blob API 下載檔案的方法，適合需要實作檔案下載功能的前端開發參考。

[[toc]]

## `<a>` 標籤下載

### 基本用法

```html
<a href="/path/to/file.pdf" download="filename.pdf">下載檔案</a>
```

- `download` 屬性會提示瀏覽器下載檔案而不是開啟
- 可以指定下載後的檔案名稱

### 同網域限制

`<a>` 標籤的 `download` 屬性有同源政策（Same-Origin Policy）限制：

```html
<!-- ✅ 同網域：可以使用 download 屬性 -->
<a href="/files/document.pdf" download="my-document.pdf">下載</a>

<!-- ❌ 跨網域：download 屬性會被忽略，檔案會在新分頁開啟 -->
<a href="https://example.com/file.pdf" download="file.pdf">下載</a>
```

**同網域限制的原因：**
- 安全考量：防止惡意網站下載使用者不想要的檔案
- 隱私保護：避免跨網域存取敏感資源

## AJAX Blob 下載

當需要下載跨網域檔案或需要更多控制時，可以使用 AJAX 搭配 Blob API：

### 基本實作

```javascript
async function downloadFile(url, filename) {
  try {
    // 發送請求獲取檔案
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 轉換為 Blob
    const blob = await response.blob();
    
    // 創建下載連結
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // 觸發下載
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下載失敗:', error);
  }
}

// 使用範例
downloadFile('/api/files/report.pdf', 'monthly-report.pdf');
```

### 帶進度條的下載

```javascript
async function downloadFileWithProgress(url, filename, onProgress) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 獲取檔案大小
    const contentLength = response.headers.get('Content-Length');
    const total = parseInt(contentLength, 10);
    
    // 讀取資料流
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      received += value.length;
      
      // 回報進度
      if (onProgress && total) {
        onProgress(Math.round((received / total) * 100));
      }
    }
    
    // 合併 chunks 並創建 Blob
    const blob = new Blob(chunks);
    
    // 創建下載連結
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error('下載失敗:', error);
  }
}

// 使用範例
downloadFileWithProgress(
  '/api/large-file.zip',
  'large-file.zip',
  (progress) => {
    console.log(`下載進度: ${progress}%`);
    // 更新進度條 UI
  }
);
```

### 處理不同檔案類型

```javascript
async function downloadFileWithType(url, filename, mimeType) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // 指定 MIME 類型
    const blob = new Blob([arrayBuffer], { type: mimeType });
    
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error('下載失敗:', error);
  }
}

// 使用範例
downloadFileWithType('/api/data.json', 'data.json', 'application/json');
downloadFileWithType('/api/image.png', 'image.png', 'image/png');
```

## 方法比較

| 方法 | 優點 | 缺點 | 適用場景 |
|------|------|------|----------|
| `<a>` 標籤 | 簡單、原生支援 | 同網域限制、無進度回饋 | 同網域檔案下載 |
| AJAX Blob | 可跨網域、支援進度條、更多控制 | 程式碼較複雜、消耗記憶體 | 需要進度回饋或跨網域下載 |

## 注意事項

### 記憶體使用
- Blob 會將整個檔案載入記憶體，大檔案可能造成效能問題
- 下載完成後記得使用 `URL.revokeObjectURL()` 釋放記憶體

### 瀏覽器相容性
- Blob API 支援所有現代瀏覽器
- `download` 屬性在 IE 中不支援

### CORS 設定
使用 AJAX 下載跨網域檔案時，伺服器需要正確設定 CORS：

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

## 參考資料

- [MDN - HTML `<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [MDN - Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)