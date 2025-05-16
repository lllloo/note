# Git 指令

---

## 常規提交
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 更改遠端
```sh
git remote -v
git remote set-url origin <url>
```
- `git remote -v`：查看目前遠端倉庫網址。
- `git remote set-url origin <url>`：更改遠端 origin 的網址。

---

## 刪除分支
### 刪除本地分支
```sh
git branch -d localBranchName
```
### 刪除遠端分支
```sh
git push origin --delete remoteBranchName
```

---

## 強制拉遠端分支覆蓋本地
```sh
git pull -f origin develop:develop
```

---

## cherry-pick

### 合併其他分支的 Commit
```sh
git cherry-pick fd23e1c 6a498ec f4f4442
git cherry-pick '第1個' '第2個' '第3個'
```

---

## diff-tree

### 顯示 HEAD 與上一個 HEAD^ 差異的檔案
```sh
git diff-tree -r --name-only --diff-filter=ACMRT HEAD~ HEAD
```

### 將 HEAD 與上一個 HEAD^ 差異的檔案打包成 zip
```sh
git archive --format=zip --output=update.zip HEAD $(git diff-tree -r --name-only --diff-filter=ACMRT HEAD~ HEAD)
```

### 兩個 commit 差異打包
```sh
git archive --format=zip --output=update.zip HEAD $(git diff-tree -r --name-only --diff-filter=ACMRT HEAD~2 HEAD)
```
