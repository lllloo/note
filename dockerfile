# 第一階段：建構 vitepress 靜態網站
FROM node:20-slim AS builder

# 安裝 git 並避免額外推薦的套件，然後清理快取 : lastUpdated 功能需要
RUN apt-get update && apt-get install --no-install-recommends -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

# 第二階段：nginx serve 靜態檔案
FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html