---
applyTo: '**/\*.vue, **/_.ts, \*\*/_.js, \*_/_.scss'
description: '使用 Composition API 與 TypeScript 的 Vue 3 開發標準與最佳實務'
---

# VueJS 3 開發指引

本文件說明使用 Composition API、TypeScript 與現代最佳實務來建置高品質 Vue 3 應用程式的指引。

## 專案背景

- 以 Vue 3.x 為基礎，預設使用 Composition API
- 使用 TypeScript 提供型別安全
- 單檔元件（Single File Components，`.vue`），採用 `<script setup>` 語法
- 現代化建置工具（建議使用 Vite）
- 使用 Pinia 作為應用程式狀態管理
- 遵循官方 Vue 風格指引與最佳實務

## 開發標準

### 架構

- 優先使用 Composition API（`setup` 函數與 composables），而非 Options API
- 按功能或領域組織元件與 composables 以利擴展性
- 將以 UI 為主的元件（presentational）與以邏輯為主的元件（container）分離
- 將可重用邏輯抽取為放在 `composables/` 的 composable 函式
- 以領域劃分 Pinia store 模組，明確定義 actions、state 與 getters

### TypeScript 整合

- 在 `tsconfig.json` 中啟用 `strict` 模式以獲得最大型別安全
- 使用 `defineComponent` 或在 `<script setup lang="ts">` 中搭配 `defineProps` 與 `defineEmits`
- 使用 `PropType<T>` 為 props 定義型別與預設值
- 對複雜的 prop 與 state 結構使用 interface 或 type alias
- 為事件處理器、refs 與 `useRoute`/`useRouter` 等 hook 定義型別
- 在適用時實作泛型元件與 composable

### 元件設計

- 元件遵循單一職責原則（Single Responsibility Principle）
- 元件名稱使用 PascalCase，檔名使用 kebab-case
- 保持元件小且專注於單一職責
- 使用 `<script setup>` 以精簡程式碼並提升效能
- 以 TypeScript 驗證 props；僅在必要時使用執行時檢查
- 優先使用 slots 與 scoped slots 提供彈性組合

### 狀態管理

- 使用 Pinia 作為全域狀態管理：以 `defineStore` 定義 stores
- 針對簡單的區域狀態，在 `setup` 中使用 `ref` 與 `reactive`
- 使用 `computed` 表示衍生狀態
- 對複雜結構保持 state 正規化（normalized）
- 將非同步邏輯放在 Pinia store 的 actions 中
- 使用 store 外掛來處理持久化或除錯需求

### Composition API 模式

- 為共用邏輯建立可重用的 composable，例如 `useFetch`、`useAuth`
- 使用 `watch` 與 `watchEffect` 時明確指定依賴清單
- 在 `onUnmounted` 或 `watch` 的 cleanup callback 中清理副作用
- 對於深層依賴注入（dependency injection）謹慎使用 `provide`/`inject`
- 可使用 `useAsyncData` 或第三方資料工具（例如 Vue Query）

### 樣式（Styling）

- 元件層級樣式使用 `<style scoped>` 或 CSS Modules
- 可考慮使用以工具為先（utility-first）的框架（例如 Tailwind CSS）以加速開發
- 依照 BEM 或 functional CSS 慣例命名 class
- 使用 CSS 自訂屬性（custom properties）做主題與設計變數管理
- 採用 mobile-first 思維，使用 CSS Grid 與 Flexbox 實作響應式設計
- 確保樣式可及性（對比、聚焦狀態等）

### 性能最佳化

- 使用動態 import 與 `defineAsyncComponent` 延遲載入元件
- 使用 `<Suspense>` 提供非同步元件載入的 fallback UI
- 對靜態或不常變動的元素使用 `v-once` 與 `v-memo`
- 使用 Vue DevTools 的 Performance 分頁進行效能分析
- 避免不必要的 watchers；能用 `computed` 則優先使用
- 透過 tree-shaking 移除未使用程式碼，並善用 Vite 的最佳化功能

### 資料取得

- 使用 composable（例如 `useFetch` 在 Nuxt 中）或像 Vue Query 的函式庫
- 明確處理 loading、error 與 success 狀態
- 在元件卸載或參數變更時取消過期的請求
- 實作樂觀更新（optimistic updates），並在失敗時回滾
- 快取回應並使用背景重新驗證（background revalidation）

### 錯誤處理

- 使用全域錯誤處理器（`app.config.errorHandler`）處理未捕捉的錯誤
- 將風險較高的邏輯包在 `try/catch` 中，並提供友善的使用者訊息
- 在元件中使用 `errorCaptured` hook 建立局部錯誤邊界
- 優雅地顯示 fallback UI 或錯誤提示
- 將錯誤記錄到外部服務（例如 Sentry、LogRocket）

### 表單與驗證

- 使用 VeeValidate 或 @vueuse/form 等函式庫進行聲明式驗證
- 使用受控的 `v-model` 綁定來建立表單
- 在 blur 或 input 時進行驗證，並使用 debounce 提升效能
- 將檔案上傳與複雜的多步驟表單邏輯放在 composable 中處理
- 確保標籤、錯誤提示與焦點管理的可及性

### 路由

- 使用 Vue Router 4，搭配 `createRouter` 與 `createWebHistory`
- 實作巢狀路由與路由層級的程式碼分割
- 使用導覽守衛（`beforeEnter`、`beforeEach`）保護路由
- 在 `setup` 中使用 `useRoute` 與 `useRouter` 進行程式化導覽
- 正確管理 query 參數與動態路由段（dynamic segments）
- 可透過 route meta 欄位提供 breadcrumb 資料

### 測試

- 使用 Vue Test Utils 與 Jest 撰寫單元測試
- 測試應聚焦於行為，而非實作細節
- 使用 `mount` 與 `shallowMount` 進行元件隔離測試
- 需要時 mock 全域外掛（router、Pinia）
- 加入 E2E 測試（Cypress 或 Playwright）
- 使用 axe-core 進行無障礙測試整合

### 安全性

- 避免使用 `v-html`；若需使用請嚴格消毒 HTML 輸入
- 使用 CSP 標頭以減輕 XSS 與注入攻擊風險
- 在模板與指令中驗證並逃逸資料
- 對所有 API 請求使用 HTTPS
- 將敏感 token 存放在 HTTP-only cookie，而非 `localStorage`

### 無障礙（Accessibility）

- 使用語意化的 HTML 元素與 ARIA 屬性
- 管理模態視窗與動態內容的焦點
- 為互動元件提供鍵盤導覽
- 為圖片與圖示添加有意義的 `alt` 文字
- 確保色彩對比符合 WCAG AA 標準

## 實作流程

1. 規劃元件與 composable 的架構
2. 使用 Vite 初始化 Vue 3 + TypeScript 專案
3. 定義 Pinia stores 與 composables
4. 建立核心 UI 元件與版面（layout）
5. 整合路由與導覽
6. 實作資料擷取與狀態邏輯
7. 建置具驗證與錯誤狀態的表單
8. 加入全域錯誤處理與 fallback UI
9. 新增單元測試與 E2E 測試
10. 優化效能與 bundle 大小
11. 確保無障礙合規
12. 文件化元件、composables 與 stores

## 額外指引

- 遵循 Vue 官方風格指引（vuejs.org/style-guide）
- 使用 ESLint（`plugin:vue/vue3-recommended`）與 Prettier 確保程式碼一致性
- 撰寫有意義的 commit 訊息並維持乾淨的 git 歷史
- 定期更新相依套件並稽核安全性漏洞
- 使用 JSDoc/TSDoc 註解複雜邏輯
- 使用 Vue DevTools 進行除錯與效能分析

## 常用模式

- Renderless 元件與 scoped slots 用於彈性 UI
- 使用 provide/inject 組成複合元件（compound components）
- 自訂指令（custom directives）處理跨領域關注事項
- 使用 Teleport 實作模態與遮罩層
- 建立外掛系統提供全域工具（如 i18n、analytics）
- 使用可參數化的 composable factories 產生邏輯
