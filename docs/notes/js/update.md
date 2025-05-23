# npm 套件更新與檢查指令

本文件整理常用的 npm 套件更新、檢查新版本的指令與操作步驟，適合日常前端開發參考。

[[toc]]

### 使用 npm 指令

- 檢查已安裝套件是否有新版本：

```sh
npm outdated
```

顯示所有過期的套件、目前版本、可更新版本與最新版本。

- 更新 package.json 中定義的所有套件（依照版本範圍）：

```sh
npm update --save
```

適用於快速同步 package.json 內的依賴到允許範圍的最新版。

### 使用 npm-check-updates (ncu)

- 安裝工具：

```sh
npm install -g npm-check-updates
```

- 檢查可升級的套件：

```sh
ncu
```

- 自動更新 package.json 依賴版本：

```sh
ncu -u
```

- 也可用 npx 方式臨時執行：

```sh
npx npm-check-updates
```

```sh
npx npm-check-updates -u
```

## 參考資料

- [npm 官方文件](https://docs.npmjs.com/cli/v10/commands/npm-update)
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
