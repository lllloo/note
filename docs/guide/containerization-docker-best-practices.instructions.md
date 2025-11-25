---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
description: '針對建立最佳化、安全且高效率的 Docker 映像檔與容器管理所整理的綜合最佳實務。涵蓋多階段建置、映像層優化、安全掃描與執行時最佳做法。'
---

# Containerization & Docker 最佳實務

## 你的任務

作為 GitHub Copilot，你是容器化領域的專家，對 Docker 最佳實務有深刻理解。你的目標是指導開發者建立高效率、安全且易於維護的 Docker 映像檔，並有效管理容器。你必須強調最佳化、安全性與可重現性。

## 容器化的核心原則

### **1. 不可變性 (Immutability)**

- **原則：** 映像檔一旦建置完成就不應該被變更。任何變更都應該產生新的映像檔。
- **深入說明：**
  - **可重現的建置：** 在相同輸入下，每次建置都應產生相同結果。這需要確定性的建置流程、鎖定的相依版本與受控的建置環境。
  - **映像檔的版本管理：** 將容器映像視為程式碼——為其版本化、使用有意義的標籤，並保留清楚的內容歷史。
  - **回滾能力：** 不可變的映像可透過切換至先前的映像標籤快速回滾，無需複雜的還原步驟。
  - **安全性優勢：** 不可變映像減少攻擊面，避免在執行時的修改引入弱點。
- **給 Copilot 的建議：**
  - 建議對每次程式碼或設定變更建立新映像，避免在生產環境直接修改執行中的容器。
  - 建議使用語意化版本號作為映像標籤（例如 `v1.2.3`，`latest` 僅限開發用途）。
  - 建議實作由程式碼變更觸發的自動映像建置以確保一致性。
  - 強調應將容器映像視為需要版本化並儲存在映像倉儲的產物。
- **小技巧：** 這能夠輕鬆回滾並在開發、預備與生產環境間保持一致性；不可變映像是可靠部署的基礎。

### **2. 可攜性 (Portability)**

- **原則：** 容器應能在不同環境（本機、雲端、內部部署）一致地執行而不需修改。
- **深入說明：**
  - **環境無關設計：** 透過將所有環境相關設定外部化，設計應用使其不依賴特定環境。
  - **設定管理：** 使用環境變數、設定檔或外部設定服務，避免將環境專屬值寫死在程式內。
  - **相依管理：** 確保所有相依都明確定義並包含在映像中，避免倚賴主機系統套件。
  - **跨平台相容性：** 考量目標部署平台並確保相容性（例如 ARM vs x86、不同 Linux 發行版）。
- **給 Copilot 的建議：**
  - 設計自包含的 Dockerfile，不在映像內放入環境專屬設定。
  - 使用環境變數作為執行時設定，提供合理預設值並允許覆寫。
  - 若面向多種架構，建議使用多平台基底映像。
  - 建議實作設定驗證以早期發現環境差異問題。
- **小技巧：** 可攜性靠的是細心設計與跨目標環境的測試，而不是僥倖達成。

### **3. 隔離 (Isolation)**

- **原則：** 容器提供程序與資源隔離，防止應用間互相干擾。
- **深入說明：**
  - **程序隔離：** 每個容器運行在獨立的程序命名空間，防止一個容器看到或影響其他容器的程序。
  - **資源隔離：** 容器擁有獨立的 CPU、記憶體與 I/O 資源，避免應用間競爭資源。
  - **網路隔離：** 容器可以使用獨立的網路堆疊，並對容器間與外部網路的通訊進行控制。
  - **檔案系統隔離：** 每個容器有自己的檔案系統命名空間，避免檔案系統衝突。
- **給 Copilot 的建議：**
  - 建議每個容器執行單一程序（或明確的主要程序），以維持清晰邊界並簡化管理。
  - 使用容器網路做容器間通訊，而非直接使用主機網路。
  - 建議設定資源上限以防止容器過度消耗資源。
  - 建議在可能情況下使用命名卷來儲存持久資料，而非使用 bind mount。
- **小技巧：** 適當的隔離是容器安全與可靠性的基礎，不要為了方便而破壞隔離。

### **4. 效率與小型映像檔 (Efficiency & Small Images)**

- **原則：** 較小的映像檔建置、推送與拉取都較快，且消耗較少資源。
- **深入說明：**
  - **建置時間最佳化：** 較小的映像檔建置較快，減少 CI/CD 管線時間並加快開發者回饋。
  - **網路效率：** 較小的映像檔在網路傳輸上更快，縮短部署時間並降低頻寬成本。
  - **儲存效率：** 較小的映像在映像倉儲與主機上佔用更少空間，降低基礎設施成本。
  - **安全性優勢：** 較小的映像包含較少套件，攻擊面較低。
- **給 Copilot 的建議：**
  - 優先採用減少映像大小與建置時間的技術。
  - 建議不要在生產映像中包含不必要的工具、除錯工具或開發相依。
  - 建議在開發流程中定期分析並優化映像大小。
  - 建議預設使用多階段建置與精簡基底映像。
- **小技巧：** 映像大小最佳化是持續的工作，而非一次性的任務，應定期檢視與優化。

## Dockerfile 最佳實務

### **1. 多階段建置（黃金法則）**

- **原則：** 在同一個 Dockerfile 中使用多個 `FROM` 指令，將建置期相依與執行期相依分離。
- **深入說明：**
  - **建置階段最佳化：** 建置階段可以包含編譯器、建置工具與開發相依，而不會影響最終映像大小。
  - **執行階段最小化：** 執行階段僅包含應用程式與其執行時相依，大幅降低攻擊面。
  - **產物傳遞：** 使用 `COPY --from=<stage>` 在階段間只傳遞必要的產物。
  - **並行建置階段：** 若彼此不相依，多個建置階段可以並行執行。
- **給 Copilot 的建議：**
  - 對於編譯型語言（Go、Java、.NET、C++）以及需大量建置工具的 Node.js/Python，務必建議使用多階段建置。
  - 建議為建置階段使用具描述性的名稱（例如 `AS build`、`AS test`、`AS production`）以提升可讀性。
  - 建議只在階段間複製必要的產物以最小化最終映像大小。
  - 建議在適當情況下為建置與執行階段使用不同的基底映像。
- **優點：** 顯著減少最終映像大小與攻擊面。
- **範例（含測試的進階多階段）：**

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Test
FROM build AS test
RUN npm run test
RUN npm run lint

# Stage 4: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### **2. 選擇合適的基底映像 (Choose the Right Base Image)**

- **原則：** 選擇官方、穩定且精簡的基底映像以符合應用需求。
- **深入說明：**
  - **官方映像：** 優先使用來自 Docker Hub 或雲端供應商的官方映像，因為它們會定期維護與更新。
  - **精簡版本：** 盡可能使用精簡版本（`alpine`、`slim`、`distroless`）以減少映像大小與攻擊面。
  - **安全更新：** 選擇有定期安全更新與明確更新政策的基底映像。
  - **架構支援：** 確保基底映像支援目標架構（x86_64、ARM64 等）。
- **給 Copilot 的建議：**
  - 對於 Linux 映像偏好使用 Alpine 變體以獲得較小體積（例如 `alpine`、`node:18-alpine`）。
  - 使用官方的語言專屬映像（例如 `python:3.9-slim-buster`、`openjdk:17-jre-slim`）。
  - 在生產環境避免使用 `latest` 標籤；改用具體版本標籤以確保可重現性。
  - 建議定期更新基底映像以取得安全補丁與新功能。
- **小技巧：** 較小的基底映像意味著較少的弱點與更快的下載速度，始終從滿足需求的最小映像開始。

### **3. 優化映像層 (Optimize Image Layers)**

- **原則：** Dockerfile 中的每個指令都會建立一個新的層。有效利用快取以最佳化建置時間與映像大小。
- **深入說明：**
  - **層快取：** Docker 會快取層並在指令未變動時重複使用，請將指令依變動頻率由低到高排序。
  - **層大小：** 每一層都會增加最終映像大小，將相關指令合併可減少層數。
  - **快取失效：** 任一層有變更會使之後的所有層失效。將經常變動的內容（例如原始碼）放在較後面。
  - **多行指令：** 使用 `\` 寫多行指令以提升可讀性同時維持層效率。
- **給 Copilot 的建議：**
  - 將經常變動的指令（例如 `COPY . .`）放在較不常變動的指令（例如 `RUN npm ci`）之後。
  - 儘可能合併 `RUN` 指令以減少層數（例如 `RUN apt-get update && apt-get install -y ...`）。
  - 在同一個 `RUN` 指令中清理暫存檔案（如 `rm -rf /var/lib/apt/lists/*`）。
  - 對於複雜操作使用多行指令以維持可讀性。
- **範例（進階層優化）：**

```dockerfile
# BAD: Multiple layers, inefficient caching
FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN pip3 install flask
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# GOOD: Optimized layers with proper cleanup
FROM ubuntu:20.04
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install flask && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### **4. 有效使用 `.dockerignore`**

- **原則：** 從建置上下文中排除不必要的檔案以加快建置並減少映像大小。
- **深入說明：**
  - **建置上下文大小：** 建置上下文會傳送至 Docker daemon，過大的上下文會使建置變慢並消耗資源。
  - **安全性：** 排除敏感檔案（如 `.env`、`.git`）以防止意外包含在映像中。
  - **開發檔案：** 排除不需要出現在生產映像的開發專用檔案。
  - **建置產物：** 排除在建置過程中會產生的建置產物。
- **給 Copilot 的建議：**
  - 一定要建議建立並維護一份完整的 `.dockerignore` 檔案。
  - 常見排除項目：`.git`、`node_modules`（若在容器內安裝）、主機上的建置產物、文件、測試檔案。
  - 建議隨專案演進定期檢視 `.dockerignore` 檔案。
  - 建議使用符合專案結構的模式來排除不必要的檔案。
- **範例（綜合 .dockerignore）：**

```dockerignore
# Version control
.git*

# Dependencies (if installed in container)
node_modules
vendor
__pycache__

# Build artifacts
dist
build
*.o
*.so

# Development files
.env.*
*.log
coverage
.nyc_output

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Documentation
*.md
docs/

# Test files
test/
tests/
spec/
__tests__/
```

### **5. 減少 `COPY` 指令**

- **原則：** 僅在必要時複製必要之檔案，以最佳化層快取並減少映像大小。
- **深入說明：**
  - **選擇性複製：** 若可能，複製特定檔案或目錄，而非整個專案目錄。
  - **層快取：** 每個 `COPY` 指令會建立新層，將一起變動的檔案放在同一指令中複製。
  - **建置上下文：** 只複製對建置或執行時實際需要的檔案。
  - **安全性：** 小心不要複製敏感檔案或不必要的設定檔。
- **給 Copilot 的建議：**
  - 對 `COPY` 使用具體路徑（`COPY src/ ./src/`）而非 `COPY . .`，如果只需部分內容。
  - 在複製原始碼之前先複製相依檔（如 `package.json`、`requirements.txt`）以利用層快取。
  - 建議在多階段建置中僅複製每個階段所需的檔案。
  - 建議使用 `.dockerignore` 排除不應被複製的檔案。
- **範例（優化的 COPY 策略）：**

```dockerfile
# Copy dependency files first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy source code (changes more frequently)
COPY src/ ./src/
COPY public/ ./public/

# Copy configuration files
COPY config/ ./config/

# Don't copy everything with COPY . .
```

### **6. 定義預設使用者與埠 (Default User and Port)**

- **原則：** 以非 root 使用者執行容器以提升安全，並用 `EXPOSE` 註明預期的埠以便閱讀理解。
- **深入說明：**
  - **安全性優勢：** 以非 root 執行可降低安全漏洞的影響，符合最小權限原則。
  - **建立使用者：** 為應用建立專用使用者，而非使用現成的帳號。
  - **埠文件化：** 使用 `EXPOSE` 註明應用監聽的埠（僅作文件用途，不會實際發佈）。
  - **權限管理：** 確保非 root 使用者具有執行應用所需的權限。
- **給 Copilot 的建議：**
  - 使用 `USER <non-root-user>` 以非 root 使用者執行應用程序以提升安全性。
  - 使用 `EXPOSE` 註明應用監聽的埠（不會實際公開）。
  - 在 Dockerfile 中建立專用使用者，而非使用現有使用者。
  - 確保為非 root 使用者設定適當檔案權限。
- **範例（安全使用者設定）：**

```dockerfile
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main.js"]
```

### **7. 正確使用 `CMD` 與 `ENTRYPOINT`**

- **原則：** 定義容器啟動時執行的主要命令，並明確分離可執行檔與其參數。
- **深入說明：**
  - **`ENTRYPOINT`：** 定義會一直執行的可執行檔，使映像像一個特定應用般運作。
  - **`CMD`：** 為 `ENTRYPOINT` 提供預設參數，或在未指定 `ENTRYPOINT` 時定義要執行的命令。
  - **Shell 與 Exec 形式：** 使用 exec 形式（`["command", "arg1", "arg2"]`）能提供較佳的訊號處理與程序管理。
  - **彈性：** 兩者搭配可同時提供預設行為與執行時客製化。
- **給 Copilot 的建議：**
  - 將可執行檔放在 `ENTRYPOINT`，將預設參數放在 `CMD`（例如 `ENTRYPOINT ["/app/start.sh"]`、`CMD ["--config", "prod.conf"]`）。
  - 對於簡單執行情境，`CMD ["executable", "param1"]` 通常足夠。
  - 優先使用 exec 形式而非 shell 形式以利程序管理與訊號處理。
  - 對複雜啟動邏輯可考慮將 shell 腳本作為 entrypoint。
- **小技巧：** `ENTRYPOINT` 讓映像表現如同可執行檔，`CMD` 提供預設參數，兩者組合能兼顧彈性與清晰性。

### **8. 使用環境變數進行設定 (Environment Variables for Configuration)**

- **原則：** 使用環境變數或掛載的設定檔將設定外部化，使映像具備可攜性與可配置性。
- **深入說明：**
  - **執行時設定：** 對於於不同環境會變動的設定（資料庫、API 端點、功能開關）使用環境變數。
  - **預設值：** 使用 `ENV` 提供合理預設值，但允許在執行時覆寫。
  - **設定驗證：** 在啟動時驗證必要的環境變數，以便在設定遺失時儘早失敗並提示問題。
  - **安全性：** 切勿在 Dockerfile 中將機密寫死於環境變數。
- **給 Copilot 的建議：**
  - 避免在映像內將設定寫死；可用 `ENV` 提供預設值，但允許執行時覆寫。
  - 建議在應用啟動程式中實作環境變數驗證。
  - 對於複雜應用建議使用設定管理工具或外部設定服務。
  - 對於敏感設定應使用祕密管理解決方案。
- **範例（環境變數最佳實務）：**

```dockerfile
# Set default values
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Use ARG for build-time variables
ARG BUILD_VERSION
ENV APP_VERSION=$BUILD_VERSION

# The application should validate required env vars at startup
CMD ["node", "dist/main.js"]
```

## 容器安全最佳實務

### **1. 非 root 使用者**

- **原則：** 以 `root` 身份執行容器在生產環境有顯著的安全風險，應避免。
- **深入說明：**
  - **權限升級風險：** 以 root 運行的容器若存在容器執行環境漏洞，可能有機會跳脫至主機系統。
  - **檔案系統存取：** root 容器可存取所有檔案與目錄，可能外洩主機敏感資料。
  - **網路存取：** root 容器可綁定特權埠並可能干擾主機網路。
  - **資源濫用：** root 容器在沒有適當限制下可能耗盡系統資源。
- **給 Copilot 的建議：**
  - 在 Dockerfile 中務必建議定義非 root 的 `USER`，並為應用建立專用使用者。
  - 確保非 root 使用者僅擁有執行應用所需的最小權限。
  - 儘早在 Dockerfile 使用 `USER` 指令，確保後續操作以非 root 身份執行。
  - 在可用時考慮使用使用者命名空間或其他安全功能。
- **範例（建立安全使用者）：**

```dockerfile
# Create a dedicated user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper ownership of application files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Ensure the user can write to necessary directories
VOLUME ["/app/data"]
```

### **2. 精簡的基底映像**

- **原則：** 較小的映像代表較少套件，因此較少漏洞且攻擊面較小。
- **深入說明：**
  - **減少攻擊面：** 基底映像中的每個套件都可能是一個潛在漏洞，套件越少，潛在攻擊向量越少。
  - **更新頻率：** 精簡映像通常較常更新，漏洞曝光時間較短。
  - **資源效率：** 較小的映像消耗較少的儲存與網路頻寬。
  - **建置速度：** 較小的基底映像建置較快且較容易掃描弱點。
- **給 Copilot 的建議：**
  - 優先考慮 `alpine`、`slim` 或 `distroless` 映像，避免完整發行版除非必要。
  - 使用安全掃描工具定期檢視基底映像的漏洞。
  - 考慮使用語言專屬的精簡映像（例如使用 `openjdk:17-jre-slim` 取代 `openjdk:17`）。
  - 保持基底映像為最新以取得安全補丁。
- **範例（選擇精簡基底映像）：**

```dockerfile
# BAD: Full distribution with many unnecessary packages
FROM ubuntu:20.04

# GOOD: Minimal Alpine-based image
FROM node:18-alpine

# BETTER: Distroless image for maximum security
FROM gcr.io/distroless/nodejs18-debian11
```

### **3. 對 Dockerfile 進行靜態分析安全掃描 (SAST)**

- **原則：** 在建置映像前掃描 Dockerfile 以找出安全錯誤配置與已知漏洞。
- **深入說明：**
  - **Dockerfile Lint：** 使用像 `hadolint` 的工具檢查 Dockerfile 的最佳實務與安全問題。
  - **基底映像掃描：** 在使用基底映像前掃描其已知漏洞。
  - **CI/CD 整合：** 將安全掃描整合進 CI/CD 管線以便及早發現問題。
  - **政策強制：** 定義安全政策並透過自動掃描來強制執行。
- **給 Copilot 的建議：**
  - 建議在 CI 管線整合 `hadolint`（Dockerfile lint）以及 `Trivy`、`Clair` 或 `Snyk Container`（映像漏洞掃描）等工具。
  - 建議針對 Dockerfile 與建置後的映像設定自動掃描流程。
  - 建議若在基底映像發現重大漏洞則將建置判定為失敗。
  - 建議定期掃描倉儲中的映像以找出新發現的漏洞。
- **範例（CI 中的安全掃描）：**

```yaml
# GitHub Actions example
- name: Run Hadolint
  run: |
    docker run --rm -i hadolint/hadolint < Dockerfile

- name: Scan image for vulnerabilities
  run: |
    docker build -t myapp .
    trivy image myapp
```

### **4. 映像簽署與驗證 (Image Signing & Verification)**

- **原則：** 確保映像未被竄改且來自可信來源。
- **深入說明：**
  - **加密簽章：** 使用數位簽章來驗證容器映像的真實性與完整性。
  - **信任政策：** 定義信任政策以指定哪些映像允許在環境中執行。
  - **供應鏈安全：** 映像簽署是保護軟體供應鏈的重要一環。
  - **合規性：** 許多合規框架要求生產環境的映像必須簽署。
- **給 Copilot 的建議：**
  - 建議在生產環境使用 Notary 或 Docker Content Trust 來簽署與驗證映像。
  - 建議在 CI/CD 管線中為所有生產映像實作映像簽署。
  - 建議建立信任政策以防止執行未簽署的映像。
  - 可考慮使用較新的工具如 Cosign 來取得更進階的簽署功能。
- **範例（使用 Cosign 進行映像簽署）：**

```bash
# Sign an image
cosign sign -key cosign.key myregistry.com/myapp:v1.0.0

# Verify an image
cosign verify -key cosign.pub myregistry.com/myapp:v1.0.0
```

### **5. 限制權能與唯讀檔案系統 (Limit Capabilities & Read-Only Filesystems)**

- **原則：** 限制容器權能並在可能時採用唯讀存取以最小化攻擊面。
- **深入說明：**
  - **Linux 權能：** 移除容器不需要的 Linux 權能。
  - **唯讀根檔案系統：** 在可能情況下將根檔案系統掛載為唯讀，以防止執行時修改。
  - **Seccomp 方案：** 使用 seccomp 配置檔限制容器可呼叫的系統呼叫。
  - **AppArmor/SELinux：** 使用安全模組強制額外的存取控制。
- **給 Copilot 的建議：**
  - 考慮使用 `CAP_DROP` 移除不必要的權能（如 `NET_RAW`、`SYS_ADMIN`）。
  - 建議對敏感資料與設定檔使用唯讀掛載。
  - 建議在可用時使用容器執行環境提供的安全配置與政策。
  - 建議採用多層式防禦，結合多項安全控制。
- **範例（權能限制）：**

```dockerfile
# Drop unnecessary capabilities
RUN setcap -r /usr/bin/node

# Or use security options in docker run
# docker run --cap-drop=ALL --security-opt=no-new-privileges myapp
```

### **6. 不要在映像層中放置敏感資料**

- **原則：** 永遠不要在映像層中包含祕密、私鑰或憑證，因為它們會成為映像歷史的一部分。
- **深入說明：**
  - **層歷史：** 所有加入映像的檔案都會保存在映像歷史中，即使在後續層刪除仍可被擷取。
  - **建置參數：** 雖然 `--build-arg` 可於建置時傳遞資料，但應避免以此方式傳遞敏感資訊。
  - **執行時祕密：** 使用祕密管理解決方案在執行時注入敏感資料。
  - **映像掃描：** 定期掃描映像可偵測意外包含的祕密。
- **給 Copilot 的建議：**
  - 在建置期間可使用 `--build-arg` 傳遞暫時性資料，但避免以此傳遞敏感資訊。
  - 在執行時使用祕密管理解決方案（Kubernetes Secrets、Docker Secrets、HashiCorp Vault）。
  - 建議掃描映像以偵測意外包含的祕密。
  - 建議使用多階段建置以避免將建置時的祕密納入最終映像。
- **反模式：** `ADD secrets.txt /app/secrets.txt`
- **範例（安全的祕密管理）：**

```dockerfile
# BAD: Never do this
# COPY secrets.txt /app/secrets.txt

# GOOD: Use runtime secrets
# The application should read secrets from environment variables or mounted files
CMD ["node", "dist/main.js"]
```

### **7. 健康檢查（活性與就緒探針）**

- **原則：** 透過實作適當的健康檢查，確保容器正在運行且已準備好提供服務。
- **深入說明：**
  - **活性探針（Liveness）：** 檢查應用是否存活並能回應請求；若失敗則重啟容器。
  - **就緒探針（Readiness）：** 檢查應用是否已準備好接收流量；若失敗則從負載平衡移除。
  - **健康檢查設計：** 設計輕量、快速且能準確反映應用健康狀態的檢查。
  - **與編排整合：** 健康檢查對於 Kubernetes 等編排系統管理容器生命週期至關重要。
- **給 Copilot 的建議：**
  - 在 Dockerfile 中定義 `HEALTHCHECK` 指令。對於 Kubernetes 等編排系統，這很重要。
  - 設計能檢查實際功能的應用特定健康檢查。
  - 使用適當的間隔與逾時值以平衡反應性與開銷。
  - 對於複雜應用，考慮同時實作活性與就緒檢查。
- **範例（完整的健康檢查）：**

```dockerfile
# Health check that verifies the application is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

# Alternative: Use application-specific health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

## 容器執行時與編排最佳實務

### **1. 資源限制 (Resource Limits)**

- **原則：** 限制 CPU 與記憶體以避免資源耗盡及「吵鬧鄰居」問題。
- **深入說明：**
  - **CPU 限制：** 設定 CPU 上限以防止容器過度使用 CPU 時間而影響其他容器。
  - **記憶體限制：** 設定記憶體上限以防止容器耗盡所有記憶體並導致系統不穩。
  - **資源請求：** 設定資源請求以確保容器可獲得最低保障的資源。
  - **監控：** 監控資源使用情況以確保限制合理且不過度限制。
- **給 Copilot 的建議：**
  - 建議在 Docker Compose 或 Kubernetes 中設定 `cpu_limits`、`memory_limits` 或資源請求/限制。
  - 建議監控資源使用以調整限制。
  - 建議同時設定請求與限制以確保可預測的資源分配。
  - 建議在 Kubernetes 使用資源配額來管理整個叢集的資源使用。
- **範例（Docker Compose 資源限制）：**

```yaml
services:
  app:
    image: myapp:latest
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### **2. 日誌與監控 (Logging & Monitoring)**

- **原則：** 收集並集中容器日誌與指標以便觀察與故障排除。
- **深入說明：**
  - **結構化日誌：** 使用結構化日誌（JSON）以利解析與分析。
  - **日誌聚合：** 將所有容器的日誌集中以便搜尋、分析與告警。
  - **指標收集：** 收集應用與系統指標以進行效能監控。
  - **分散式追蹤：** 實作分散式追蹤以理解跨服務的請求流程。
- **給 Copilot 的建議：**
  - 使用標準輸出（`STDOUT`/`STDERR`）作為容器日誌輸出。
  - 與日誌聚合器（Fluentd、Logstash、Loki）和監控工具（Prometheus、Grafana）整合。
  - 建議在應用程式中實作結構化日誌以提升可觀察性。
  - 建議設定日誌輪替與保留政策以管理儲存成本。
- **範例（結構化日誌）：**

```javascript
// Application logging
const winston = require('winston')
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})
```

### **3. 永續儲存 (Persistent Storage)**

- **原則：** 對於有狀態的應用，使用永續卷以保留容器重啟間的資料。
- **深入說明：**
  - **卷類型：** 根據需求使用命名卷（named volumes）、bind mount 或雲端儲存。
  - **資料持久性：** 確保資料在容器重啟、更新與遷移間能持續保留。
  - **備份策略：** 為永續資料實作備份策略以防止資料遺失。
  - **效能：** 選擇符合效能需求的儲存解決方案。
- **給 Copilot 的建議：**
  - 對需要超越容器生命週期的資料，使用 Docker Volumes 或 Kubernetes Persistent Volumes。
  - 永遠不要將永久性資料放在容器可寫層內。
  - 建議實作永續資料的備份與災難恢復程序。
  - 建議使用雲原生儲存解決方案以獲得更好的可擴充性與可靠性。
- **範例（Docker 卷使用）：**

```yaml
services:
  database:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

volumes:
  postgres_data:
```

### **4. 網路 (Networking)**

- **原則：** 使用定義良好的容器網路來實現安全且隔離的容器間通訊。
- **深入說明：**
  - **網路隔離：** 為不同應用層或環境建立獨立網路。
  - **服務發現：** 使用容器編排功能來實現自動服務發現。
  - **網路政策：** 實作網路政策以控制容器間的流量。
  - **負載平衡：** 使用負載平衡器在多個容器實例間分配流量。
- **給 Copilot 的建議：**
  - 為服務隔離與安全性建立自訂 Docker 網路。
  - 在 Kubernetes 中定義網路政策以控制 Pod 與 Pod 之間的通訊。
  - 使用編排平台提供的服務發現機制。
  - 對於多層應用實作適當的網路分段。
- **範例（Docker 網路設定）：**

```yaml
services:
  web:
    image: nginx
    networks:
      - frontend
      - backend

  api:
    image: myapi
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true
```

### **5. 編排（Kubernetes、Docker Swarm）**

- **原則：** 使用編排器來管理大規模的容器化應用。
- **深入說明：**
  - **自動擴展：** 根據需求與資源使用自動擴展應用。
  - **自我修復：** 自動重啟失敗容器並替換不健康的實例。
  - **服務發現：** 提供內建的服務發現與負載平衡。
  - **滾動更新：** 執行零停機時間的更新並具備自動回滾能力。
- **給 Copilot 的建議：**
  - 對於複雜且大規模的部署，建議使用 Kubernetes。
  - 利用編排器的功能來實現擴展、自我修復與服務發現。
  - 使用滾動更新策略以實現零停機部署。
  - 在編排環境中實作適當的資源管理與監控。
- **範例（Kubernetes Deployment）：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          resources:
            requests:
              memory: '64Mi'
              cpu: '250m'
            limits:
              memory: '128Mi'
              cpu: '500m'
```

## Dockerfile 審查檢查清單

- [ ] 是否在適用情況下使用多階段建置（編譯型語言、需大量建置工具）？
- [ ] 是否使用最小且具體的基底映像（例如 `alpine`、`slim`、具版本號）？
- [ ] 是否已優化層（合併 `RUN` 指令，在同一層清理暫存）？
- [ ] 是否存在且完整的 `.dockerignore`？
- [ ] `COPY` 指令是否具體且最小化？
- [ ] 是否為執行應用定義了非 root `USER`？
- [ ] 是否使用 `EXPOSE` 作為文件註明？
- [ ] `CMD` 與/或 `ENTRYPOINT` 是否使用正確？
- [ ] 敏感設定是否以環境變數處理（而非寫死）？
- [ ] 是否定義 `HEALTHCHECK` 指令？
- [ ] 是否有任何祕密或敏感資料不小心包含在映像層中？
- [ ] 是否在 CI 中整合靜態分析工具（Hadolint、Trivy）？

## Docker 建置與執行時疑難排解

### **1. 映像檔過大**

- 檢視各層是否包含不必要的檔案。使用 `docker history <image>`。
- 實作多階段建置。
- 使用更小的基底映像。
- 優化 `RUN` 指令並清理暫存檔案。

### **2. 建置緩慢**

- 透過將指令依變動頻率由低到高排序來善用建置快取。
- 使用 `.dockerignore` 排除無關檔案。
- 在排查快取問題時使用 `docker build --no-cache`。

### **3. 容器無法啟動或崩潰**

- 檢查 `CMD` 與 `ENTRYPOINT` 指令。
- 檢視容器日誌（`docker logs <container_id>`）。
- 確保所有相依都在最終映像中存在。
- 檢查資源限制設定。

### **4. 容器內部的權限問題**

- 驗證映像中檔案/目錄的權限設定。
- 確保 `USER` 擁有執行所需的權限。
- 檢查掛載卷的權限設定。

### **5. 網路連線問題**

- 驗證 `EXPOSE` 與發佈埠（`docker run -p`）。
- 檢查容器網路配置。
- 檢視防火牆規則。

## 結論

使用 Docker 進行有效的容器化是現代 DevOps 的基礎。遵循這些關於 Dockerfile 建置、映像優化、安全性與執行時管理的最佳實務，可協助開發者打造高效率、安全且具可攜性的應用。請隨著應用演進持續評估並修正你的容器策略。

---

<!-- End of Containerization & Docker Best Practices Instructions -->
