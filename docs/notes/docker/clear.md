# Docker 資源清理指令彙整

這份文件說明如何在 Docker 中移除不必要的資源（如未使用的容器、映像檔、網路、資料卷等），以釋放磁碟空間，並提供常用清理指令與注意事項。

[[toc]]

## 一鍵清除所有未使用資源

清除下列資源：

- 停止的容器
- 未使用的網路
- 沒有被任何容器使用的映像檔
- 建立時產生的中間暫存層

```sh
docker system prune
```

::: tip 指令說明
適合快速釋放空間，建議定期執行。
:::

更徹底加上 `-a`
額外刪除所有**未使用**的映像檔（包括已經建構但未被執行的）

```sh
docker system prune -a
```

::: warning 注意
此指令會移除所有未被任何容器使用的映像檔，請確認無需保留再執行。
:::

## 移除已停止的容器

```sh
docker container prune
```

## 移除未使用的映像檔

移除未被任何容器使用的懸掛映像檔：

```sh
docker image prune
```

加上 `-a` 可刪除所有未被任何容器使用的映像檔。

```sh
docker image prune -a
```

::: warning 注意
`-a` 參數會移除所有未被任何容器使用的映像檔，請確認無需保留再執行。
:::

## 移除未使用的網路

```sh
docker network prune
```

## 移除未使用的資料卷

```sh
docker volume prune
```

## 查看目前使用空間

```sh
docker system df
```

## 參考資料

- [Docker Official Documentation - docker system prune](https://docs.docker.com/reference/cli/docker/system/prune/)
