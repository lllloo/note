# GitHub Actions 寄送 Discord 通知

透過 [`sarisia/actions-status-discord`](https://github.com/sarisia/actions-status-discord) action，可以在 GitHub Actions 工作流程完成後，自動發送通知訊息至 Discord 頻道。

[[toc]]

## 設定 Discord Webhook

1. 在 Discord 頻道設定中，選擇「整合」→「Webhook」→「建立 Webhook」
2. 複製 Webhook URL
3. 前往 GitHub 儲存庫的「Settings」→「Secrets and variables」→「Actions」
4. 新增 Secret，名稱設為 `DISCORD_WEBHOOK`，值貼上剛才複製的 Webhook URL

## 基本用法

```yaml
- name: Discord 通知
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: '✅ 部署成功'
    description: '服務已成功部署'
    color: 0x00ff00
```

### 常用參數

| 參數 | 說明 | 預設值 |
| --- | --- | --- |
| `webhook` | Discord Webhook URL（必填） | — |
| `title` | 通知標題 | job 名稱 |
| `description` | 通知內容說明 | — |
| `color` | 訊息左側色條顏色（十六進位色碼） | — |
| `status` | 顯示狀態（Success / Failure 等） | 自動偵測 |
| `url` | 標題連結 URL | 當前 workflow run URL |
| `username` | Discord Bot 名稱 | GitHub Actions |
| `avatar_url` | Discord Bot 頭像 URL | — |
| `nodetail` | 隱藏詳細資訊（`true`/`false`） | `false` |

## 依結果自動通知

搭配 `if: always()` 與 `status: ${{ job.status }}`，可以用一個 step 自動依結果發送對應的通知訊息，顏色與狀態文字會自動設定：

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: echo "部署中..."

      - name: Discord 通知
        if: always()
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          status: ${{ job.status }}
```

> `if: always()` 確保無論成功、失敗或取消都會執行通知 step。

### 自訂通知訊息

如果想根據結果顯示不同的標題與說明，可以搭配 expressions：

```yaml
      - name: Discord 通知
        if: always()
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          status: ${{ job.status }}
          title: ${{ job.status == 'success' && '✅ 部署成功' || '❌ 部署失敗' }}
          description: ${{ job.status == 'success' && '服務已成功部署' || '服務部署失敗' }}
```

## 完整範例：部署工作流程

以下為含有建置、部署與 Discord 通知的完整 workflow 範例：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Discord 建置通知
        if: always()
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          status: ${{ job.status }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      # 以下為示意，請替換為實際部署步驟
      - name: Deploy
        run: echo "部署中..."

      - name: Discord 部署通知
        if: always()
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          status: ${{ job.status }}
```

## 常見色碼

| 顏色 | 十六進位 |
| --- | --- |
| 綠色（成功） | `0x00ff00` |
| 紅色（失敗） | `0xff0000` |
| 黃色（警告） | `0xffff00` |
| 藍色（資訊） | `0x0000ff` |
