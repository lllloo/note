# 疑難雜症

本文件彙整開發過程中遇到的各種疑難雜症與解決方案,記錄問題發生的情境、原因分析及實際解決方法,協助快速解決類似問題。

[[toc]]

## 檔案下載相關

### Content-Disposition 無法取得

瀏覽器在下載檔案時無法正確取得 `Content-Disposition` header 中的檔案名稱資訊。

- [Content-Disposition 無法取得](./content-disposition) - CORS 設定與 header 存取權限問題

## 圖片處理相關

圖片上傳、顯示與處理過程中遇到的常見問題。

### 圖片上傳後旋轉

上傳的圖片在網頁中顯示時發生非預期的旋轉,與原始圖片方向不一致。

- [圖片上傳後旋轉](./image-orientation) - EXIF 方向資訊處理問題

### iOS 圖片高度異常

在 iOS 裝置上顯示圖片時,高度計算或渲染出現異常,導致圖片變形或顯示不正確。

- [iOS 圖片高度異常](./image-height) - iOS Safari 圖片渲染問題

## 平台相容性問題

特定平台或應用程式環境中的相容性問題。

### Line 無法跳轉 Blob URL

在 Line 應用程式的內建瀏覽器中,無法正常開啟或跳轉使用 Blob URL 的連結。

- [Line 無法跳轉 Blob URL](./line-browser-blob-url) - Line 內建瀏覽器的 Blob URL 限制
