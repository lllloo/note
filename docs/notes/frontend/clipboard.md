# 怎麼把文字複製到剪貼簿

`navigator.clipboard.writeText` 是瀏覽器提供的剪貼簿 API，可用於將文字寫入使用者的剪貼簿。

[[toc]]

## 基本用法

```js
navigator.clipboard
  .writeText('要複製的文字')
  .then(() => {
    console.log('文字已複製到剪貼簿')
  })
  .catch((err) => {
    console.error('複製失敗:', err)
  })
```

## async/await 與 try-catch 用法

```js
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('文字已複製到剪貼簿')
  } catch (err) {
    console.error('複製失敗:', err)
  }
}
```

## 注意事項

- 需在 HTTPS 網站或 localhost 執行。
- 必須由使用者主動觸發（如點擊按鈕），否則瀏覽器可能拒絕。
- 某些瀏覽器或環境（如 iframe、隱私模式）可能不支援。
- 失敗時可提示用戶手動複製。

## 參考資料

- [MDN Clipboard API](https://developer.mozilla.org/zh-TW/docs/Web/API/Clipboard_API)
- [Clipboard API - Google Developers](https://web.dev/async-clipboard/)
- [Can I use Clipboard API](https://caniuse.com/?search=clipboard)
