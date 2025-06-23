# Cookie

這份文件說明如何在前端專案中使用 [js-cookie](https://github.com/js-cookie/js-cookie) 套件進行 Cookie 操作，包含安裝、基本用法、常見情境與注意事項，適合日常前端開發參考。

[[toc]]

## 為什麼要用 js-cookie？

雖然可以用原生 JavaScript 操作 Cookie，但 js-cookie 有以下優點：

- **語法簡潔易懂**：提供 set/get/remove 等直觀 API，減少繁瑣字串處理，程式碼更易讀。
- **自動處理編碼**：自動處理 Cookie 的編碼與解碼，避免資料錯誤。
- **支援多屬性設定**：可輕鬆設定 expires、path、domain、secure、sameSite 等屬性，原生需自行組合字串，容易出錯。
- **取得所有 Cookie**：可直接取得所有 Cookie（物件），原生只能解析字串。
- **跨瀏覽器相容性**：自動處理不同瀏覽器的細節與相容性問題。

總結：js-cookie 讓 Cookie 操作更安全、簡單、可維護，適合日常前端開發使用。

## 基本用法

### import

```js
import Cookies from 'js-cookie'
```

### 設定 Cookie

```js
Cookies.set('name', 'value')
// 設定過期時間（天數）
Cookies.set('name', 'value', { expires: 7 })
// 設定路徑
Cookies.set('name', 'value', { path: '' })
```

### 讀取 Cookie

```js
Cookies.get('name') // 取得指定 Cookie 值
Cookies.get() // 取得所有 Cookie（物件）
```

### 刪除 Cookie

```js
Cookies.remove('name')
// 若設定 path，刪除時也需指定相同 path
Cookies.remove('name', { path: '' })
```

### withAttributes 用法

`withAttributes` 可用於預設多個屬性，產生一個新的 Cookies 實例，後續 set/remove 皆自動帶入這些屬性，適合多次操作同一組屬性時簡化程式碼。

```js
const myCookies = Cookies.withAttributes({ expires: 7 })
myCookies.set('token', 'abc')
myCookies.remove('token')
```

## 如果有 node.js 需求可以考慮 universal-cookie

雖然 js-cookie 已能滿足大多數前端需求，但若你的專案有以下情境，建議改用 [universal-cookie](https://github.com/reactivestack/cookies) ：

- 需要同時在伺服器端（Node.js）與瀏覽器端操作 Cookie，例如 Next.js、Nuxt.js、SSR 等同構應用。
- 需於 React 等框架的伺服器端取得或設定 Cookie。
- 希望前後端共用一致的 Cookie 操作 API，簡化跨平台開發。

universal-cookie 提供更彈性的 API，適合現代全端應用場景。

## 參考資料

- [js-cookie 官方文件](https://github.com/js-cookie/js-cookie)
- [universal-cookie 官方文件](https://github.com/reactivestack/cookies)
- [MDN Cookie](https://developer.mozilla.org/zh-TW/docs/Web/API/Document/cookie)
