---
applyTo: '.github/workflows/*.yml,.github/workflows/*.yaml'
description: '使用 GitHub Actions 建立健全、安全且高效率 CI/CD 管線的完整指南。涵蓋工作流程結構、Jobs、Steps、環境變數、祕密管理、快取、矩陣策略、測試與佈署策略。'
---

# GitHub Actions CI/CD 最佳實務

## 你的任務

作為 GitHub Copilot，你是設計與優化 GitHub Actions CI/CD 管線的專家。你的任務是協助開發者建立高效率、安全且可靠的自動化工作流程，用於建置、測試與部署應用程式。你必須優先考量最佳實務、確保安全性，並提供可操作且詳細的指引。

## 核心概念與結構

### 1. 工作流程結構 (`.github/workflows/*.yml`)

- 原則: 工作流程應該清晰、模組化且易於理解，以促進可重用性與可維護性。
- 深入說明:
  - 命名慣例: 為工作流程檔案使用一致且具描述性的名稱（例如 `build-and-test.yml`、`deploy-prod.yml`）。
  - 觸發條件 (`on`): 理解各類事件：`push`、`pull_request`、`workflow_dispatch`（手動）、`schedule`（排程 cron）、`repository_dispatch`（外部事件）、`workflow_call`（可重用工作流程）。
  - 併發控制 (`concurrency`): 使用 `concurrency` 以避免特定分支或群組的同時執行，減少競態條件或資源浪費。
  - 權限 (`permissions`): 在工作流程層級定義 `permissions` 以建立安全的預設值，必要時於 Job 層級覆寫。
- 給 Copilot 的指引:
  - 始終以具描述性的 `name` 與合適的 `on` 觸發條件開始。建議對特定情境使用精細的觸發條件（例如 `on: push: branches: [main]` 與 `on: pull_request` 的差異）。
  - 建議使用 `workflow_dispatch` 作為手動觸發，可接受輸入參數以提高彈性並控制部署。
  - 建議對關鍵工作流程或共用資源設定 `concurrency`，以避免資源競爭。
  - 指導如何為 `GITHUB_TOKEN` 設定明確權限，遵循最小權限原則。
- 小技巧: 對於複雜的專案，考慮使用可重用工作流程（`workflow_call`）來抽象共用的 CI/CD 模式並減少跨專案的重複。

### 2. Jobs

- 原則: Jobs 應該代表 CI/CD 管線中獨立且明確的階段（例如 build、test、deploy、lint、security scan）。
- 深入說明:
  - `runs-on`: 選擇合適的 runner。`ubuntu-latest` 常見，但也可根據需求使用 `windows-latest`、`macos-latest` 或 `self-hosted`。
  - `needs`: 明確定義依賴關係。若 Job B `needs` Job A，則 Job B 只有在 Job A 成功完成後才會執行。
  - `outputs`: 使用 `outputs` 在 Jobs 間傳遞資料。這對分離關注點很重要（例如 build job 輸出 artifact 路徑，deploy job 使用該路徑）。
  - `if` 條件: 廣泛使用 `if` 條件以根據分支名稱、提交訊息、事件類型或先前 Job 狀態進行條件執行（`if: success()`、`if: failure()`、`if: always()`）。
  - Job 分組: 考慮將大型工作流程拆成較小且專注的 Jobs，以便平行或序列化執行。
- 給 Copilot 的指引:
  - 定義具有清楚 `name` 與合適 `runs-on` 的 `jobs`（例如 `ubuntu-latest`、`windows-latest`、`self-hosted`）。
  - 使用 `needs` 定義 Jobs 間的依賴，確保順序與流程合理。
  - 使用 `outputs` 有效率地在 Jobs 間傳遞資料，促進模組化。
  - 利用 `if` 條件進行有條件的 Job 執行（例如只在 `main` 分支 push 時部署，或僅於特定 PR 執行 E2E 測試，或根據檔案變動跳過某些 Job）。
- 範例（條件部署與輸出傳遞）:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact_path: ${{ steps.package_app.outputs.path }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies and build
        run: |
          npm ci
          npm run build
      - name: Package application
        id: package_app
        run: | # Assume this creates a 'dist.zip' file
          zip -r dist.zip dist
          echo "path=dist.zip" >> "$GITHUB_OUTPUT"
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: my-app-build
          path: dist.zip

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: my-app-build
      - name: Deploy to Staging
        run: |
          unzip dist.zip
          echo "Deploying ${{ needs.build.outputs.artifact_path }} to staging..."
          # Add actual deployment commands here
```

### 3. Steps 與 Actions

- 原則: Steps 應該原子且定義明確，Actions 必須有版本管理以維持穩定性與安全性。
- 深入說明:
  - `uses`: 參考 Marketplace actions（例如 `actions/checkout@v4`、`actions/setup-node@v3`）或自訂 action。為了安全與不變性，建議針對最大長度的 commit SHA 進行鎖定，或至少使用主要版本標籤（例如 `@v4`）。避免使用 `main` 或 `latest`。
  - `name`: 有助於清晰的日誌與除錯，請讓 step 名稱具描述性。
  - `run`: 執行 shell 指令。對複雜邏輯使用多行腳本，若在建立映像時也可合併指令以優化 layer 快取。
  - `env`: 在 step 或 job 層級定義環境變數。請勿在此硬編碼敏感資料。
  - `with`: 為 action 傳入輸入參數，並確保所有必要輸入皆已提供。
- 給 Copilot 的指引:
  - 使用 `uses` 參考 Marketplace 或自訂 action，並總是指定安全版本（tag 或 SHA）。
  - 每個 step 使用 `name` 以利日誌可讀性與除錯。
  - 使用 `run` 執行 shell 指令，使用 `&&` 組合指令以提高效率，並用 `|` 進行多行腳本。
  - 明確提供 `with` 輸入，並使用表達式（`${{ }}`）處理動態值。
- 安全注意: 使用前務必稽核 Marketplace action，偏好信賴的來源（例如 `actions/` 組織），並在可能時檢視其原始碼。使用 `dependabot` 自動更新 action 版本。

## GitHub Actions 的安全最佳實務

### 1. 祕密管理

- 原則: 對祕密必須妥善管理，切勿在日誌中曝光，且只能讓獲授權的工作流程/Job 存取。
- 深入說明:
  - GitHub Secrets: 儲存敏感資訊的主要機制。資料在靜止時加密，僅在傳遞到 runner 時解密。
  - 環境祕密: 若需更細緻的控制，可建立環境特定的祕密，並可設定人工核准或分支條件以保護。
  - 祕密遮蔽: GitHub Actions 會自動在日誌中遮蔽祕密，但仍建議避免直接列印。
  - 最小範圍: 只授予確實需要的工作流程/Job 存取祕密的權限。
- 給 Copilot 的指引:
  - 一律建議使用 GitHub Secrets 儲存敏感資訊（例如 API key、密碼、雲端憑證、token）。
  - 在工作流程中透過 `secrets.<SECRET_NAME>` 存取祕密。
  - 建議對部署環境採用環境專屬的祕密，以加強存取控制與核准流程。
  - 不建議動態構造祕密或將祕密列印到日誌，即使被遮蔽也不例外。
- 範例（具有核准的環境祕密）:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://prod.example.com
    steps:
      - name: Deploy to production
        env:
          PROD_API_KEY: ${{ secrets.PROD_API_KEY }}
        run: ./deploy-script.sh
```

### 2. 使用 OpenID Connect (OIDC) 進行雲端驗證

- 原則: 使用 OIDC 可在雲端提供者（AWS、Azure、GCP 等）間實現安全的無憑證驗證，避免長期靜態憑證。
- 深入說明:
  - 短期憑證: OIDC 交換 JWT token 以換取臨時雲端憑證，顯著降低攻擊面。
  - 信任政策: 需要在雲端環境中設定身份提供者與信任政策，以信任 GitHub 的 OIDC 提供者。
  - 聯合身份 (Federated Identity): 是現代安全雲端部署的重要模式。
- 給 Copilot 的指引:
  - 強烈建議使用 OIDC 來驗證 AWS、Azure、GCP 等雲端提供者，而非以祕密保存長期存取金鑰。
  - 提供如何為常見雲端供應商設定 OIDC 的範例（例如 `aws-actions/configure-aws-credentials@v4`）。
  - 解釋信任政策的概念以及其在 OIDC 設定中的關聯。
- 小技巧: OIDC 是更安全的雲端部署趨勢，應優先考慮採用。

### 3. `GITHUB_TOKEN` 的最小權限

- 原則: 只授與工作流程所需的 `GITHUB_TOKEN` 權限，以在遭受入侵時減少影響範圍。
- 深入說明:
  - 預設權限: `GITHUB_TOKEN` 預設擁有較廣的權限，應明確限制。
  - 細緻權限: 在工作流程或 Job 層級定義 `permissions`（例如 `contents: read`、`pull-requests: write`、`issues: read`）。
  - 預設唯讀: 建議以 `contents: read` 作為預設，僅在明確需要時才增加寫入權限。
- 給 Copilot 的指引:
  - 在工作流程或 Job 層級設定 `permissions` 以限制存取，並優先使用 `contents: read`。
  - 不建議使用 `contents: write` 或 `pull-requests: write`，除非工作流程確實需要修改內容。
  - 提供常見需求對應到 `GITHUB_TOKEN` 權限的清楚對照。
- 範例（最小權限）：

```yaml
permissions:
  contents: read # Default is write, explicitly set to read-only for security
  pull-requests: write # Only if workflow needs to update PRs
  checks: write # For updating checks

jobs:
  lint:
    permissions:
      contents: read # This job only needs to read code, override workflow default
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
```

### 4. 依賴性檢視與軟體組成分析 (SCA)

- 原則: 持續掃描相依套件以偵測已知漏洞與授權問題。
- 深入說明:
  - 早期偵測: 在 CI 管線早期整合相依性檢查，以在部署前發現問題。
  - 工具: 使用 `dependency-review-action`、Snyk、Trivy、Mend（前 WhiteSource）等工具。
  - 供應鏈安全: 這是保護軟體供應鏈的重要一環。
- 給 Copilot 的指引:
  - 在 CI 管線整合 `dependency-review-action` 或其他 SCA 工具。
  - 建議定期掃描第三方函式庫的漏洞，並為新發現設定告警。
  - 強調維護最新相依清單與理解間接相依的重要性。

### 5. 靜態程式碼安全掃描 (SAST)

- 原則: 在執行前於原始碼層級找出安全漏洞。
- 深入說明:
  - Shift Left: SAST 可在開發生命週期早期發現並修補漏洞，成本較低。
  - 工具: CodeQL、SonarQube、Bandit（Python）、搭配安全插件的 ESLint（JS/TS）。
  - 自動化強制: 可將 SAST 設為阻斷步驟，若發現關鍵漏洞則中斷 build 或阻擋 PR。
- 給 Copilot 的指引:
  - 在 CI 管線中整合 SAST 工具（例如使用 CodeQL 或開源替代工具）。
  - 將安全掃描設定為在發現關鍵漏洞時阻斷流程，以建立預設安全措施。
  - 建議在 pre-commit hook 中加入安全 linters 或靜態分析以提早回饋。

### 6. 祕密掃描與憑證洩漏預防

- 原則: 防止祕密被提交到代碼庫或暴露於日誌中。
- 深入說明:
  - GitHub Secret Scanning: GitHub 提供內建的祕密掃描功能以偵測庫內祕密。
  - Pre-commit Hooks: 使用像 `git-secrets` 的工具可在本地阻止祕密提交。
  - 僅以環境變數傳遞: 祕密應僅在運行時傳遞到需要的環境，絕不應包含於 build 輸出。
- 給 Copilot 的指引:
  - 建議啟用 GitHub 的內建祕密掃描功能。
  - 建議實作 pre-commit hook 以掃描常見祕密模式。
  - 建議審查工作流程日誌以檢查是否有意外暴露，即便有遮蔽也應注意。

### 7. 不可變基礎架構與映像簽章

- 原則: 確保容器映像與部署產物不可被竄改且可驗證。
- 深入說明:
  - 可複現的建置: 確保同一份程式碼的建置結果能生成相同的映像。
  - 映像簽章: 使用 Notary 或 Cosign 等工具對容器映像進行加密簽章，以驗證來源與完整性。
  - 部署門檻: 強制只允許已簽章的映像進行生產部署。
- 給 Copilot 的指引:
  - 倡導在 Dockerfile 與建置流程中實作可複現建置。
  - 建議在 CI 管線中整合映像簽章與部署前的簽章驗證。

## 優化與效能

### 1. GitHub Actions 的快取

- 原則: 快取相依與建置輸出以顯著加快後續工作流程執行速度。
- 深入說明:
  - 快取命中率: 透過設計有效的快取金鑰以提高命中率。
  - 快取金鑰: 使用基於檔案雜湊的唯一金鑰（例如 `hashFiles('/package-lock.json')`、`hashFiles('/requirements.txt')`），僅在相依變更時使快取失效。
  - 還原金鑰 (`restore-keys`): 提供回退至較舊或相容快取的方案。
  - 快取作用範圍: 了解快取是以 repository 與分支為範圍。
- 給 Copilot 的指引:
  - 使用 `actions/cache@v3` 快取常見套件管理器的相依（Node.js 的 `node_modules`、Python 的 `pip` 套件、Java 的 Maven/Gradle 相依）與建置產物。
  - 使用 `hashFiles` 設計高效的快取金鑰以確保最佳命中率。
  - 建議使用 `restore-keys` 做為優雅的回退機制。
- 範例（Monorepo 的進階快取）：

```yaml
- name: Cache Node.js modules
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ./node_modules # For monorepos, cache specific project node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-${{ github.run_id }}
    restore-keys: |
      ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-node-
```

### 2. 使用矩陣策略進行平行化

- 原則: 在多種設定（例如不同 Node.js 版本、作業系統、Python 版本、瀏覽器類型）上平行執行 Jobs 以加速測試與建置。
- 深入說明:
  - `strategy.matrix`: 定義變數矩陣。
  - `include`/`exclude`: 精細調整組合。
  - `fail-fast`: 控制矩陣中某個工作失敗時是否停止整體策略。
  - 最大化併發: 適合同時在不同環境跑測試。
- 給 Copilot 的指引:
  - 使用 `strategy.matrix` 在不同環境、程式語言版本或作業系統上並行測試應用程式。
  - 使用 `include` 與 `exclude` 精簡矩陣組合以在不增加不必要執行數的情況下最佳化測試覆蓋率。
  - 建議視情況設定 `fail-fast: true`（預設）以快速回饋關鍵失敗，或 `fail-fast: false` 以取得完整報告。
- 範例（多版本、多 OS 測試矩陣）：

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false # Run all tests even if one fails
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x, 18.x, 20.x]
        browser: [chromium, firefox]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install Playwright browsers
        run: npx playwright install ${{ matrix.browser }}
      - name: Run tests
        run: npm test
```

### 3. 自託管 Runner（Self-Hosted Runners）

- 原則: 當需要特殊硬體、存取私有資源的網路，或 GitHub 提供的 runner 成本過高時，使用自託管 runner。
- 深入說明:
  - 自訂環境: 適合需大容量建置快取、特定硬體（例如 GPU）或要存取內部資源的情境。
  - 成本優化: 對於高使用量情境，自託管 runner 可能更具成本效益。
  - 安全考量: 需自行保護與維運基礎設施、管理網路存取與更新，包含系統加固、存取控制與即時補丁。
  - 可擴充性: 規劃自託管 runner 如何隨需求擴展，採用手動或自動擴展方案。
- 給 Copilot 的指引:
  - 當 GitHub-hosted runner 無法滿足效能、成本、安全或網路需求時，建議使用自託管 runner。
  - 強調使用者需負責保護、維護與擴展自託管 runner，包括網路設定與定期安全稽核。
  - 建議使用 runner 群組以有效管理與組織自託管 runner。

### 4. 快速 checkout 與淺層 clone

- 原則: 優化 repository checkout 時間以減少整體工作流程耗時，尤其對大型倉庫十分重要。
- 深入說明:
  - `fetch-depth`: 控制抓取的 Git 歷史深度。大多數 CI/CD 建置使用 `1` 即足夠，因為通常只需要最新 commit。`fetch-depth: 0` 會抓取完整歷史，對大型倉庫會很慢，僅在必要時使用。
  - `submodules`: 若 Job 不需要子模組，避免檢出子模組，因為會增加大量開銷。
  - `lfs`: 妥善管理 Git LFS 的大型檔案，若不需要可設定 `lfs: false`。
  - Partial Clones: 對於極大型倉庫，可考慮使用 Git 的 partial clone (`--filter=blob:none` 或 `--filter=tree:0`)，此功能通常由特化 action 或 Git 用戶端設定處理。
- 給 Copilot 的指引:
  - 對大多數建置與測試工作，使用 `actions/checkout@v4` 並設定 `fetch-depth: 1` 以顯著節省時間與頻寬。
  - 只有在工作流程明確需要完整 Git 歷史時（例如發行標籤、深度提交分析或 `git blame`）才使用 `fetch-depth: 0`。
  - 若非必要，建議不要檢出子模組（`submodules: false`）。
  - 若專案包含大型二進位檔，建議優化 LFS 使用策略。

### 5. 以 Artifacts 進行 Job 與 Workflow 間的溝通

- 原則: 有效率地儲存與取回建置輸出（artifacts），以在同一工作流程或跨工作流程間傳遞資料，確保持久性與完整性。
- 深入說明:
  - `actions/upload-artifact`: 用於上傳 Job 產生的檔案或目錄。Artifacts 會自動壓縮並可供下載。
  - `actions/download-artifact`: 用於在後續 Jobs 或工作流程下載 artifacts。可下載全部或指定名稱的 artifacts。
  - `retention-days`: 對管理儲存成本與遵循規範很重要。根據 artifact 的重要性與法規需求設定適當的保存天數。
  - 使用情境: 建置輸出（執行檔、編譯結果、Docker 映像）、測試報告（JUnit XML、HTML 報告）、程式碼覆蓋報告、安全掃描結果、產生之文件、靜態網站建置等。
  - 限制: 上傳後的 artifacts 不可變更。單個 artifact 最大可達數 GB，但應注意儲存成本。
- 給 Copilot 的指引:
  - 使用 `actions/upload-artifact@v3` 與 `actions/download-artifact@v3` 在同一工作流程或跨工作流程間可靠地傳遞大型檔案，促進模組化與效率。
  - 為 artifacts 設定適當的 `retention-days` 以管理儲存成本並確保舊檔案被清理。
  - 建議上傳測試報告、覆蓋率報告與安全掃描結果作為 artifacts 以便於存取、歷史分析與整合外部報告工具。
  - 建議使用 artifacts 在 build job 與 deploy job 間傳遞已編譯的二進位或封裝好的應用程式，以確保部署的正是經過測試與建置的相同產物。

## Comprehensive Testing in CI/CD（擴充）

### 1. 單元測試（Unit Tests）

- 原則： 在每次程式碼推送時執行單元測試，確保個別程式元件（函式、類別、模組）在隔離情況下正確運作。這類測試數量最多且執行最快。
- 深入說明：
  - 快速回饋： 單元測試應該能快速執行，為開發者提供立即的品質與正確性回饋。建議對單元測試進行平行化執行。
  - 程式覆蓋率： 整合程式覆蓋率工具（例如：JS 的 Istanbul、Python 的 Coverage.py、Java 的 JaCoCo）並強制最低覆蓋率門檻。追求高覆蓋率，但應著重有意義的測試，而不僅是行數覆蓋。
  - 測試報告： 使用 `actions/upload-artifact` 上傳測試結果（例如 JUnit XML 報告），或使用能整合到 GitHub Checks/Annotations 的測試回報 action。
  - 模擬與替身（Mocking/Stubbing）： 強調使用 mock 與 stub 以隔離被測單元與其相依項目。
- 給 Copilot 的建議：
  - 在 CI pipeline 早期建立專用 job 執行單元測試，建議於每次 `push` 與 `pull_request` 時觸發。
  - 使用適合語言的測試執行器與框架（如 Jest、Vitest、Pytest、Go testing、JUnit、NUnit、XUnit、RSpec）。
  - 建議收集並發佈程式覆蓋率報告，並與 Codecov、Coveralls 或 SonarQube 等服務整合以分析趨勢。
  - 建議採用平行化策略以降低單元測試的總執行時間。

### 2. 整合測試（Integration Tests）

- 原則： 執行整合測試以驗證不同元件或服務之間的互動，確保它們能如預期協同運作。此類測試通常會涉及真實相依項（例如資料庫、API）。
- 深入說明：
  - 服務佈建： 在 job 中使用 `services` 啟動臨時資料庫、訊息佇列、外部 API 或其它相依項（通常以 Docker container 方式），以提供一致且隔離的測試環境。
  - 測試替身 vs 真實服務： 在純單元測試時採用 mock 外部服務，在整合測試時則優先使用輕量的真實實例以獲得更真實的整合驗證。
  - 測試資料管理： 規劃測試資料管理，確保測試可重複執行且在每次執行後能清理或重置資料。
  - 執行時間： 整合測試通常比單元測試慢。應優化執行並考慮較少頻率執行（例如於 PR 合併時而非每次 push）。
- 給 Copilot 的建議：
  - 使用 workflow 定義中的 `services` 或在測試期間以 Docker Compose 提供必要服務（例如 PostgreSQL/MySQL、RabbitMQ/Kafka、Redis 等）。
  - 建議在單元測試之後、E2E 測試之前執行整合測試，以便及早捕捉整合問題。
  - 提供如何在 GitHub Actions workflow 中設定 `service` container 的範例。
  - 建議整合測試執行期間的測試資料建立與清理策略。

### 3. 端對端測試（End-to-End, E2E）

- 原則： 模擬完整使用者行為，驗證從 UI 到後端的整個應用流程，確保系統從使用者角度運作如預期。
- 深入說明：
  - 工具： 使用現代 E2E 測試框架（如 Cypress、Playwright 或 Selenium）進行瀏覽器自動化。
  - 暫存環境（Staging）： 盡量在與生產相近的暫存環境執行 E2E 測試，以獲得最高的可信度。除非有專屬且隔離的資源，否則避免直接在 CI 上執行完整 E2E。
  - 降低不穩定性（Flakiness）： 預防 flakiness（不穩定測試）的方法包括使用明確等待、穩健的 selector、失敗後重試機制，以及妥善的測試資料管理。不穩定的測試會侵蝕對 pipeline 的信任。
  - 視覺回歸測試： 考慮整合視覺回歸工具（例如 Applitools、Percy）以偵測 UI 差異。
  - 回報： 在失敗時擷取截圖與影片以協助除錯。
- 給 Copilot 的建議：
  - 使用 Cypress、Playwright 或 Selenium，並提供在 GitHub Actions 中的設定建議。
  - 建議在已部署的暫存環境上執行 E2E 測試，以在上線前檢測問題並驗證完整部署流程。
  - 設定失敗時的測試回報、錄影與截圖以利除錯並提供更豐富的測試結果。
  - 建議使用穩健的元素選取策略與重試機制來降低 E2E 測試的不穩定性。

### 4. 效能與負載測試（Performance and Load Testing）

- 原則： 在預期與高峰負載下評估應用的效能與行為，以找出瓶頸、確保可擴充性，並避免迴歸。
- 深入說明：
  - 工具： JMeter、k6、Locust、Gatling、Artillery 等，根據語言、複雜度與需求選擇適合工具。
  - 整合： 將效能測試整合到 CI/CD 中以持續偵測效能退化。此類測試通常頻率較低（如每晚、每週或在重要功能合併時執行）。
  - 門檻： 定義清楚的效能門檻（如回應時間、吞吐量、錯誤率），若超出則使建置失敗。
  - 基線比較： 將當前效能指標與已建立的基線比較以檢測退化。
- 給 Copilot 的建議：
  - 建議在 CI pipeline 中為關鍵應用整合效能與負載測試，並提供常見工具的範例。
  - 建議設定效能基線，若效能退化超過門檻則使建置失敗。
  - 建議在模擬生產負載的專用環境執行這些測試。
  - 指導如何分析效能測試結果以定位優化點（例如：資料庫查詢、API 端點）。

### 5. 測試報告與可見性（Test Reporting and Visibility）

- 原則： 讓測試結果對所有利害關係人（開發、QA、產品擁有者）易於存取、理解與可見，以促進透明度並加速問題解決。
- 深入說明：
  - GitHub Checks/Annotations： 利用這些機制在 Pull Request 中直接呈現內聯回饋，顯示測試通過/失敗並提供詳細報告連結。
  - Artifacts： 將完整測試報告（JUnit XML、HTML 報告、覆蓋率、錄影、截圖）上傳為 artifacts 以便長期保存與詳細檢查。
  - 整合儀表板： 將結果推送到外部儀表板或報告工具（例如 SonarQube、Allure Report、TestRail 或自訂工具），以取得聚合視圖與歷史趨勢。
  - 狀態徽章： 在 README 中放置 GitHub Actions 的狀態徽章以快速顯示最新的 build/test 狀態。
- 給 Copilot 的建議：
  - 使用會在 PR 中發佈註解或 Checks 的 actions，以提供即時回饋並方便在 GitHub UI 中除錯。
  - 上傳詳細測試報告（XML、HTML、JSON 等）作為 artifacts，包含錯誤截圖等負面結果以供日後檢查與分析。
  - 建議與外部報告工具整合以取得更完整的測試執行趨勢與品質指標視圖。
  - 建議在 README 加入 workflow 狀態徽章以提升 CI/CD 健康狀態的可見性。

## 進階部署策略（擴充）

### 1. 暫存環境部署（Staging Environment Deployment）

- 原則： 部署到與生產高度相似的暫存環境以進行完整驗證、使用者驗收測試（UAT）與最終檢查，然後再升級到生產環境。
- 深入說明：
  - 模擬生產環境： 暫存環境在基礎設施、資料、設定與安全性上應與生產相近，任何重大差異都可能導致生產問題。
  - 自動化升級： 在通過 UAT 並取得必要人工批准後，實作從暫存到生產的自動化升級流程，以降低人為錯誤並加速發佈。
  - 環境保護： 在 GitHub Actions 使用環境保護規則以避免誤觸發部署、強制人工核准，並限制可以部署到暫存的分支。
  - 資料更新： 定期從生產（經過匿名化處理）更新暫存資料，以確保測試情境的真實性。
- 給 Copilot 的建議：
  - 建立專屬的 `environment` 用於暫存，設定核准規則、機密保護與適當的分支保護策略。
  - 設計 workflow，使在特定開發或發佈分支（例如 `develop`、`release/*`）合併成功時自動部署到暫存。
  - 建議確保暫存環境盡可能接近生產以提升測試可信度。
  - 建議在暫存上實作自動化 smoke 測試與部署後驗證。

### 2. 生產環境部署（Production Environment Deployment）

- 原則： 僅在完整驗證後部署到生產，可能包含多層人工核准與嚴格自動檢查，優先考量穩定性與零停機。
- 深入說明：
  - 人工核准： 生產部署通常需多人核准、資安審查或變更管理流程，GitHub Environments 原生支援此類機制。
  - 回滾能力： 必要以迅速回復意外問題，應確保能可靠地回滾到前一個穩定狀態。
  - 部署期間的可觀測性： 在部署期間及部署後立即監控生產環境，以偵測任何異常或效能退化，使用儀表板、告警與追蹤工具。
  - 漸進式交付： 考慮採用 blue/green、canary 或 dark launching 等進階技術以降低風險。
  - 緊急部署： 建置一條獨立的快速通道以處理關鍵 hotfix，該通道可以繞過非必要的核准，但仍保留必要的安全檢查。
- 給 Copilot 的建議：
  - 建立專屬的 `environment` 用於生產，設定必要審核者、嚴格的分支保護與明確的部署時窗。
  - 在生產部署中實作人工核准步驟，必要時與外部的 ITSM 或變更管理系統整合。
  - 強調需有明確且經過測試的回滾策略與自動回滾程序，以便部署失敗時使用。
  - 建議建立完整的監控與告警機制，以便在生產部署後立即偵測並回應問題。

### 3. 部署類型（超越基本的 Rolling Update）

- Rolling Update（預設）： 逐步以新版本替換舊的實例。適用於大多數情境，特別是無狀態應用。
  - 建議： 設定 `maxSurge`（在期望副本數之外可建立的新實例數）與 `maxUnavailable`（可不可用的舊實例數）以精細控制部署速度與可用性。
- Blue/Green 部署： 在另一個環境同時部署新版本（green）與現有穩定版本（blue），再一次性切換流量到 green。
  - 建議： 適用於需零停機且方便回滾的關鍵應用。需管理兩個相同的環境與流量路由器（負載平衡器、Ingress controller、DNS）。
  - 好處： 可透過將流量切回 blue 來立即回滾。
- Canary 部署： 逐步將新版本推出給一小部分使用者（例如 5-10%），監控其效能與錯誤率後再做全面放行。
  - 建議： 適合在可控衝擊範圍內測試新功能，可搭配 Service Mesh（Istio、Linkerd）或支援流量分割的 Ingress controllers。
  - 好處： 在最小使用者影響範圍內及早偵測問題。
- Dark Launch / Feature Flags： 部署新程式碼但透過功能旗標（feature flags）隱藏給使用者，僅在需要時開啟特定使用者/群組。
  - 建議： 將部署與釋出分離，允許持續交付但不立即對外開放新功能。可使用 LaunchDarkly、Split.io、Unleash 等功能旗標系統。
  - 好處： 降低部署風險、支援 A/B 測試並允許分階段放行。
- A/B 測試部署： 同時向不同使用者群部署多個版本，根據使用行為與商業指標比較其效能。
  - 建議： 建議與專門的 A/B 測試平台整合或利用功能旗標與分析系統自建邏輯。

### 4. 回滾策略與事件回應（Rollback Strategies and Incident Response）

- 原則： 需能在發生問題時快速且安全地回復到先前穩定版本，將停機時間與商業影響降到最低，這需要事先規劃。
- 深入說明：
  - 自動回滾： 實作根據監控告警（例如錯誤突然升高、延遲變高）或部署後健康檢查失敗自動觸發回滾的機制。
  - 版本化 Artifact： 確保先前成功的建置 artifact、Docker 映像或基礎設施狀態可用且易於部署，這對快速復原至關重要。
  - Runbooks： 撰寫清晰、簡潔且可執行的回滾程序供人工介入使用，當自動化不足或情境複雜時使用。這些文件應定期檢視與演練。
  - 事件後檢討： 進行無指責的事件檢討（PIR）以釐清根本原因、汲取教訓並實作預防措施以提升韌性並降低 MTTR。
  - 溝通計劃： 在事件與回滾期間對利害關係人有明確的溝通計劃。
- 給 Copilot 的建議：
  - 指導使用者將先前成功的建置 artifact 與映像妥善保存並版本化，以便快速復原。
  - 建議在 pipeline 中實作自動回滾步驟（由監控或健康檢查失敗觸發），並提供範例。
  - 強調以「可還原」的方式設計應用程式，使變更易於回滾。
  - 建議建立常見事件情境的完整 runbooks，包含逐步回滾指引，並說明這些文件對降低 MTTR 的重要性。
  - 指導設定具體且可操作的告警，以便觸發自動或人工回滾。

## GitHub Actions Workflow 審查檢查表（綜合）

此檢查表提供一套細緻準則，用於審查 GitHub Actions workflows，確保其符合安全性、效能與可靠性的最佳實務。

- [ ] 一般結構與設計：

  - workflow 的 `name` 是否清晰、描述性且唯一？
  - `on` 觸發器是否適合此 workflow 的用途（例如 `push`、`pull_request`、`workflow_dispatch`、`schedule`）？是否有效利用 path/branch 過濾？
  - 是否針對關鍵工作流程或共用資源使用 `concurrency` 以避免競爭條件或資源耗盡？
  - 全域 `permissions` 是否依最低權限原則設定（預設 `contents: read`），並在 job 層級做必要覆寫？
  - 是否利用可重複使用的 workflows (`workflow_call`) 以減少重複並提高可維護性？
  - workflow 是否以有意義的 job 與 step 名稱進行邏輯化組織？

- [ ] Jobs 與 Steps 的最佳實務：

  - Jobs 是否具名且代表不同階段（例如 `build`、`lint`、`test`、`deploy`）？
  - `needs` 是否正確定義以確保執行順序？
  - 是否有效使用 `outputs` 於跨 job 或跨 workflow 的資料傳遞？
  - 是否在適當情境使用 `if` 條件（例如環境特定部署、分支特定動作）？
  - 所有 `uses` 的 action 是否有安全版本鎖定（建議使用完整 commit SHA 或特定 major 版本標籤如 `@v4`），避免使用 `main` 或 `latest`？
  - `run` 指令是否有效率且乾淨（使用 `&&` 結合、即時移除暫存檔、清楚格式化的多行 script）？
  - `env` 是否在正確層級定義，且不將敏感資料硬編碼？
  - 是否為長時間執行的 jobs 設定 `timeout-minutes` 以避免掛起？

- [ ] 安全性考量：

  - 所有敏感資料是否僅透過 GitHub `secrets`（`${{ secrets.MY_SECRET }}`）存取？絕不硬編碼或在日誌中暴露（即使被遮罩）？
  - 是否在可能情況下使用 OIDC 進行雲端驗證，以取消長期憑證？
  - `GITHUB_TOKEN` 的權限範圍是否明確定義並限制為最低必要存取（以 `contents: read` 為基線）？
  - 是否整合軟體成分分析（SCA）工具（例如 `dependency-review-action`、Snyk）以掃描相依漏洞？
  - 是否整合靜態應用安全測試（SAST）工具（例如 CodeQL、SonarQube）來掃描原始碼漏洞，並讓重大問題阻擋建置？
  - 是否啟用 secret scanning，並建議在本地使用 pre-commit hooks 以防止憑證外洩？
  - 若使用容器映像，是否有映像簽章（如 Notary、Cosign）與部署驗證策略？
  - 對於自託管 runner，是否遵循安全強化指引並限制網路存取？

- [ ] 最佳化與效能：

  - 是否有效使用快取（`actions/cache`）於套件管理器相依（`node_modules`、`pip` 快取、Maven/Gradle 快取）及建置輸出？
  - cache 的 `key` 與 `restore-keys` 是否設計良好以獲得高命中率（例如使用 `hashFiles`）？
  - 是否使用 `strategy.matrix` 於不同環境、語言版本或 OS 上並行化測試或建置？
  - 在不需完整 Git 歷史時是否在 `actions/checkout` 使用 `fetch-depth: 1`？
  - 是否有效使用 artifacts(`actions/upload-artifact`、`actions/download-artifact`) 在 jobs/workflows 間傳遞資料，而非重建或重新取得？
  - 是否使用 Git LFS 管理大型檔案並優化 checkout？

- [ ] 測試策略整合：

  - 是否在 pipeline 早期配置專用 job 來執行完整的單元測試？
  - 是否定義整合測試（盡量利用 `services`）並在單元測試之後執行？
  - 是否包含 End-to-End (E2E) 測試，最好對暫存環境執行並具備降低 flakiness 的措施？
  - 是否為關鍵應用整合效能與負載測試並設定門檻？
  - 是否收集並上傳所有測試報告（JUnit XML、HTML、覆蓋率）作為 artifacts，並於 GitHub Checks/Annotations 顯示以提升可見性？
  - 是否追蹤並強制程式覆蓋率最低門檻？

- [ ] 部署策略與可靠性：

  - 暫存與生產部署是否使用 GitHub `environment` 規則並具備適當保護（人工核准、必要審核者、分支限制）？
  - 對於敏感的生產部署是否配置人工核准步驟？
  - 是否具備明確且經測試的回滾策略並儘可能自動化（例如 `kubectl rollout undo`、回復到先前穩定映像）？
  - 選擇的部署類型（rolling、blue/green、canary、dark launch）是否符合應用重要性與風險承受度？
  - 是否在部署後實作健康檢查與自動化 smoke 測試以驗證部署成功？
  - workflow 是否對暫時性錯誤具韌性（例如對易斷網路操作的重試）？

- [ ] 可觀測性與監控：
  - 日誌是否足夠以協助調試 workflow 失敗（使用 STDOUT/STDERR 輸出應用日誌）？
  - 是否收集並揭露應用與基礎設施的關鍵指標（例如 Prometheus 指標）？
  - 是否對關鍵 workflow 失敗、部署問題或生產異常設定告警？
  - 是否整合分散式追蹤（例如 OpenTelemetry、Jaeger）以理解微服務架構中的請求流程？
  - 是否適當設定 artifacts 的 `retention-days` 以管理儲存與合規需求？

## 排除/疑難排解常見的 GitHub Actions 問題（深入）

此章節提供針對在使用 GitHub Actions workflow 時經常遇到的問題之診斷與解決建議。

### 1. Workflow 未觸發或 Jobs/Steps 意外跳過

- 根本原因： `on` 觸發與預期不符、`paths` 或 `branches` 過濾錯誤、`if` 條件誤設定，或 `concurrency` 限制。
- 可執行步驟：
  - 驗證觸發器：
    - 檢查 `on` 區塊是否與欲觸發事件精確對應（如 `push`、`pull_request`、`workflow_dispatch`、`schedule`）。
    - 確保 `branches`、`tags` 或 `paths` 過濾設定正確並符合事件情境。注意 `paths-ignore` 與 `branches-ignore` 具有優先權。
    - 若使用 `workflow_dispatch`，確認 workflow 檔案位於預設分支且在手動觸發時提供所需的 `inputs`。
  - 檢視 `if` 條件：
    - 詳查 workflow、job 與 step 層級的所有 `if` 條件。一個為假的條件即可阻止執行。
    - 可在 debug step 使用 `always()` 打印上下文變數（`${{ toJson(github) }}`、`${{ toJson(job) }}`、`${{ toJson(steps) }}`）以理解評估時的狀態。
    - 在簡化的 workflow 中測試複雜的 `if` 條件。
  - 檢查 `concurrency`：
    - 若定義 `concurrency`，確認是否有先前的執行阻塞同一群組的新執行。檢查 workflow run 中的 "Concurrency" 分頁。
  - 分支保護規則： 確認分支保護規則不會阻止某些分支執行 workflow，或要求尚未通過的檢查。

### 2. 權限錯誤（`Resource not accessible by integration`、`Permission denied`）

- 根本原因： `GITHUB_TOKEN` 權限不足、環境 secrets 存取錯誤，或外部 action 權限不夠。
- 可執行步驟：
  - `GITHUB_TOKEN` 權限：
    - 檢視 workflow 與 job 層級的 `permissions` 區塊。全域預設為 `contents: read`，僅在必要時授與寫入權限（例如更新 PR 狀態需 `pull-requests: write`、發佈套件需 `packages: write`）。
    - 了解 `GITHUB_TOKEN` 預設權限可能過廣，應明確縮小範圍。
  - Secret 存取：
    - 確認 secrets 已在 repository、organization 或 environment 設定中正確配置。
    - 若使用環境 secrets，確保 workflow/job 有權存取該環境，並檢查是否有待審核的人工核准。
    - 確認 secret 名稱完全相符（例如 `secrets.MY_API_KEY`）。
  - OIDC 設定：
    - 對於 OIDC 驗證，檢查雲端供應商（AWS IAM role、Azure AD、GCP service account）中的信任策略是否正確信任 GitHub 的 OIDC 發行者。
    - 驗證被委派的角色/身分是否具備存取目標雲端資源所需的權限。

### 3. 快取問題（`Cache not found`、`Cache miss`、`Cache creation failed`）

- 根本原因： 快取 key 邏輯錯誤、`path` 不匹配、快取大小限制或頻繁失效。
- 可執行步驟：
  - 驗證快取鍵：
    - 確認 `key` 與 `restore-keys` 的設定是否正確，且僅在相依變更時動態改變（例如 `key: ${{ runner.os }}-node-${{ hashFiles('/package-lock.json') }}`）。變動過度的 key 會導致常態的 miss。
    - 使用 `restore-keys` 作為備援以增加命中率。
  - 檢查 `path`：
    - 確保 `actions/cache` 中指定的 `path` 與依賴安裝或產生 artifact 的目錄完全一致。
    - 在建立快取前確認該 `path` 存在。
  - 除錯快取行為：
    - 使用 `actions/cache/restore` 並設定 `lookup-only: true` 來檢視嘗試的 key 與 miss 原因，而不影響建置。
    - 檢閱 workflow 日誌中的 `Cache hit` 或 `Cache miss` 訊息與其對應 key。
  - 快取大小與限制： 注意 GitHub Actions 對每個 repo 的快取大小限制；若快取太大可能會被頻繁驅逐。

### 4. 長時間執行的工作流程或逾時

- 根本原因： 步驟效率不佳、未平行化、大量依賴、Docker 映像未優化或 runner 的資源瓶頸。
- 可執行步驟：
  - 分析執行時間：
    - 使用 workflow run summary 找出最耗時的 jobs 與 steps，這是優化的起點。
  - 優化步驟：
    - 使用 `&&` 結合 `run` 指令以降低 Docker build 的 layer 數與開銷。
    - 在相同 `RUN` 指令中立即清理暫存檔（`rm -rf`）。
    - 僅安裝必要的依賴。
  - 利用快取：
    - 確認 `actions/cache` 已針對重要依賴與建置輸出最佳化配置。
  - 以 Matrix 平行化：
    - 使用 `strategy.matrix` 將測試或建置拆分為可並行化的小單位。
  - 選擇合適的 runner：
    - 檢視 `runs-on`。對於資源密集型任務，考慮使用規格較大的 GitHub-hosted runner 或具更強規格的 self-hosted runner。
  - 拆分 workflows：
    - 對於過於複雜或冗長的 workflow，考慮拆分為較小、獨立的 workflows 彼此觸發或採用可重用的 workflows。

### 5. CI 中不穩定的測試（Flaky Tests）

- 根本原因： 非決定性測試、競態條件、本地與 CI 環境不一致、依賴外部服務或測試隔離不足。
- 可執行步驟：
  - 確保測試隔離：
    - 確保每個測試獨立且不依賴其他測試留下的狀態，並在每次測試或測試套件後清理資源（例如資料庫紀錄）。
  - 消除競態條件：
    - 對於整合/E2E 測試使用明確等待（例如等待元素可見、等待 API 回應），避免使用任意的 `sleep`。
    - 對與外部服務互動或有短暫性錯誤的操作實作重試。
  - 標準化環境：
    - 確保 CI 環境（Node.js 版本、Python 套件、資料庫版本）與本地開發環境盡可能一致。
    - 使用 Docker `services` 以提供一致的測試相依環境。
  - 穩健的選取器（E2E）：
    - 在 E2E 測試中使用穩定且唯一的 selector（例如 `data-testid`），避免脆弱的 CSS class 或 XPath。
  - 除錯工具：
    - 在 CI 中讓 E2E 測試於失敗時擷取截圖與錄影以視覺化排查問題。
  - 孤立執行不穩定測試：
    - 若某測試持續不穩定，將其隔離並重複執行以找出非決定性行為的根本原因。

### 6. 部署失敗（部署後應用無法正常運作）

- 根本原因： 設定漂移、環境差異、缺少執行時相依、應用錯誤或部署後的網路問題。
- 可執行步驟：
  - 完整檢視日誌：
    - 檢閱部署日誌（`kubectl logs`、應用日誌、伺服器日誌）以找出錯誤訊息、警告或部署期間與部署後的異常輸出。
  - 設定驗證：
    - 驗證環境變數、ConfigMaps、Secrets 與注入到部署中之其他設定是否齊全且格式正確，並與目標環境需求相符。
    - 使用部署前檢查來驗證設定。
  - 相依檢查：
    - 確認所有執行時相依（函式庫、框架、外部服務）是否已包含在容器映像中或已在目標環境安裝。
  - 部署後健康檢查：
    - 在部署後實作自動化 smoke 測試與健康檢查以立即驗證核心功能與連線性；若失敗即觸發回滾。
  - 網路連通性：
    - 檢查部署後各組件間的網路連線（例如應用到資料庫、服務間通訊），檢視防火牆規則、security group 與 Kubernetes network policy。
  - 立即回滾：
    - 若生產部署失敗或造成服務退化，立即觸發回滾策略以恢復服務，並在非生產環境中診斷問題。

## 結論

GitHub Actions 是一個強大且彈性的自動化平台，能管理軟體生命週期的各環節。透過嚴謹地套用這些最佳實務——從保護秘密與縮小 token 權限、到使用快取與平行化來優化效能、以及實作完整的測試與穩健的部署策略——可以協助開發團隊建立高效、安全且可靠的 CI/CD pipeline。請記得 CI/CD 是一個持續演進的旅程：持續衡量、優化並強化你的流程，以達成更快、更安全且更有信心的發佈。這份詳細文件可作為欲精通 GitHub Actions 的團隊之基礎資源。
