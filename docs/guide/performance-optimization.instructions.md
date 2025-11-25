---
applyTo: '*'
description: '最完整、實用且由工程師撰寫的效能優化指引，適用於各種語言、框架與技術棧。涵蓋前端、後端與資料庫的最佳實務，提供可執行的建議、情境檢查清單、故障排除與專家提示。'
---

# 性能優化最佳實務

## 介紹

效能不只是流行語 — 它決定了一個產品是被使用者喜愛還是被放棄。我親眼見過效能緩慢的應用如何讓使用者感到沮喪、造成雲端費用飆升，甚至流失客戶。本指南是我使用與審查過的、最有效且貼近實務的效能做法的持續匯集，涵蓋前端、後端與資料庫層面以及進階主題。請將此作為參考、檢查清單，以及用於構建快速、高效且可擴展軟體的靈感來源。

---

## 一般原則

- **先量測，後優化:** Always profile and measure before optimizing. Use benchmarks, profilers, and monitoring tools to identify real bottlenecks. Guessing is the enemy of performance.
  - *專家提示:* 使用像 Chrome DevTools、Lighthouse、New Relic、Datadog、Py-Spy，或您所用語言的內建分析器等工具。
- **針對常見情境優化:** 專注於最常被執行的程式路徑。除非極為關鍵，否則不要在罕見邊緣情況上浪費時間。
- **避免過早優化:** 先撰寫清晰、可維護的程式碼；僅在必要時才進行優化。過早優化會讓程式碼更難閱讀與維護。
- **降低資源使用:** 有效使用記憶體、CPU、網路與磁碟資源。常問自己：「可以用更少的資源完成嗎？」
- **偏好簡潔:** 簡單的演算法與資料結構通常更快且更容易優化。不要過度設計。
- **記錄性能假設:** 清楚註明任何效能關鍵或具有非顯而易見優化的程式碼。未來的維護者（包含你自己）會感謝這些註解。
- **了解平台特性:** 熟悉語言、框架與執行環境的效能特性。Python 中的快不代表在 JavaScript 也快，反之亦然。
- **自動化效能測試:** 將效能測試與基準納入 CI/CD 管線，及早捕捉回歸。
- **設定效能預算:** 定義可接受的載入時間、記憶體使用、API 延遲等限制，並以自動化檢查強制執行。

---

## 前端效能

### 渲染與 DOM
- **最小化 DOM 操作:** 盡量批次更新。頻繁的 DOM 變動成本高昂。
  - *反模式:* 在迴圈中更新 DOM。取而代之，建立 document fragment 並一次性附加。
- **虛擬 DOM 框架:** 有效率地使用 React、Vue 等，避免不必要的重新渲染。
  - *React 範例:* 使用 `React.memo`、`useMemo` 與 `useCallback` 以防止不必要的重新渲染。
- **列表的 keys:** 在列表中使用穩定的 key 以利虛擬 DOM 的差異比對。除非列表為靜態，否則避免使用陣列索引作為 key。
- **避免內聯樣式:** 內聯樣式可能觸發版面重排（layout thrashing）。優先使用 CSS 類別。
- **CSS 動畫:** 優先使用 CSS transition/animation，而非 JavaScript，以取得更流暢且 GPU 加速的效果。
- **延遲非關鍵渲染:** 使用 `requestIdleCallback` 或類似機制，待瀏覽器閒置時再執行工作。

### 資產優化
- **圖片壓縮:** 使用 ImageOptim、Squoosh 或 TinyPNG 等工具。網路傳輸時優先使用現代格式（WebP、AVIF）。
- **圖示使用 SVG:** 對於簡單圖形，SVG 可縮放且通常比 PNG 更小。
- **壓縮與打包:** 使用 Webpack、Rollup 或 esbuild 打包與壓縮 JS/CSS。啟用 tree-shaking 以移除未使用的程式碼。
- **快取標頭:** 為靜態資源設定長時效快取標頭，並在更新時使用快取破壞（cache busting）。
- **延遲載入:** 對圖片使用 `loading="lazy"`，對 JS 模組/元件使用動態匯入。
- **字型優化:** 僅使用所需字元集，對字型進行子集化，並使用 `font-display: swap`。

### 網路優化
- **減少 HTTP 請求:** 合併檔案、使用圖片精靈、並內嵌關鍵 CSS。
- **HTTP/2 與 HTTP/3:** 啟用這些協定以取得多工與較低延遲的好處。
- **用戶端快取:** 使用 Service Workers、IndexedDB 與 localStorage 支援離線與重複訪問。
- **CDN:** 從靠近使用者的 CDN 提供靜態資源，並可考慮多個 CDN 以提高冗餘度。
- **延遲/非同步腳本:** 對非關鍵 JS 使用 `defer` 或 `async`，避免阻塞渲染。
- **預載與預取:** 對關鍵資源使用 `<link rel="preload">` 與 `<link rel="prefetch">`。

### JavaScript 效能
- **避免阻塞主執行緒:** 將大量計算移至 Web Workers。
- **防抖/節流事件:** 對 scroll、resize 與 input 等事件使用 debounce/throttle 以限制處理頻率。
- **記憶體洩漏:** 清理事件監聽器、interval 與 DOM 參考。使用瀏覽器開發工具檢查已分離的節點。
- **有效的資料結構:** 使用 Map/Set 做查找，對數值資料使用 TypedArrays。
- **避免全域變數:** 全域變數可能導致記憶體洩漏與不可預期的效能問題。
- **避免深層物件複製:** 僅在必要時使用淺複製或像 lodash 的 `cloneDeep` 之類的庫。

### 可及性與效能
- **可及元件:** 確保 ARIA 更新不過度。使用語意化 HTML 兼顧可及性與效能。
- **螢幕閱讀器效能:** 避免快速且大量的 DOM 更新，可能會壓垮輔助技術。

### 框架專屬建議
#### React
- 使用 `React.memo`、`useMemo` 與 `useCallback` 以避免不必要的重新渲染。
- 拆分大型元件並使用程式碼分割（`React.lazy`、`Suspense`）。
- 避免在 render 中使用匿名函式；它們會在每次渲染時建立新參考。
- 使用 `ErrorBoundary` 捕捉並優雅處理錯誤。
- 使用 React DevTools 的 Profiler 進行分析。

#### Angular
- 對於不需頻繁更新的元件，使用 OnPush 變更檢測策略。
- 避免在 template 中使用複雜運算；將邏輯移到元件類別中。
- 在 `ngFor` 使用 `trackBy` 以提高列表渲染效率。
- 使用 Angular Router 延遲載入模組與元件。
- 使用 Angular DevTools 進行效能分析。

#### Vue
- 在 template 中使用 computed 屬性而非 methods 以便快取。
- 適當使用 `v-show` 與 `v-if`（頻繁切換可見性時 `v-show` 較佳）。
- 使用 Vue Router 延遲載入元件與路由。
- 使用 Vue Devtools 進行分析。

### 常見前端陷阱
- 首次頁面載入時載入過大的 JS 組件。
- 未壓縮圖片或使用過時格式。
- 未清理事件監聽器，導致記憶體洩漏。
- 為了簡單任務過度使用第三方函式庫。
- 忽視行動裝置效能（請在真實裝置上測試！）。

### 前端故障排除
- 使用 Chrome DevTools 的 Performance 分頁記錄並分析慢速幀。
- 使用 Lighthouse 進行效能稽核並取得可執行建議。
- 使用 WebPageTest 進行真實世界的載入測試。
- 監控 Core Web Vitals（LCP、FID、CLS）以取得以使用者為中心的指標。

---

## 後端效能

### 演算法與資料結構優化
- **選擇正確的資料結構:** 連續存取使用陣列，快速查找使用雜湊表，階層資料使用樹等。
- **有效演算法:** 在適當情況下使用二分搜尋、快速排序或基於雜湊的演算法。
- **避免 O(n^2) 或更差的複雜度:** 分析巢狀迴圈與遞迴呼叫，重構以降低複雜度。
- **批次處理:** 以批次處理資料以降低開銷（例如批量資料庫插入）。
- **串流處理:** 對大型資料集使用串流 API，避免將所有資料一次載入記憶體。

### 併發與平行
- **非同步 I/O:** 使用 async/await、callback 或事件迴圈以避免阻塞執行緒。
- **執行緒/工作者池:** 使用池化管理併發，避免資源耗盡。
- **避免競態條件:** 需要時使用鎖、信號量或原子操作。
- **批次操作:** 批次化網路/資料庫呼叫以減少往返次數。
- **背壓機制:** 在佇列與管線中實作背壓以避免過載。

### 快取
- **快取昂貴運算:** 對熱門資料使用記憶體快取（Redis、Memcached）。
- **快取失效策略:** 使用基於時間（TTL）、事件或手動失效。陳舊的快取比沒有快取更糟。
- **分散式快取:** 多伺服器架構下使用分散式快取並留意一致性問題。
- **防止快取風暴:** 使用鎖或請求合併（request coalescing）以避免 thundering herd 問題。
- **不要到處快取:** 有些資料過於頻繁變更或敏感，不適合快取。

### API 與網路
- **最小化載荷:** 使用 JSON、壓縮回應（gzip、Brotli），避免傳送不必要的資料。
- **分頁:** 對大型結果集總是分頁。對即時資料使用游標（cursors）。
- **速率限制:** 保護 API 免於濫用與過載。
- **連線池:** 重用連線以存取資料庫與外部服務。
- **協定選擇:** 對高吞吐、低延遲通訊使用 HTTP/2、gRPC 或 WebSockets。

### 日誌與監控
- **減少熱路徑中的日誌量:** 過多日誌會拖慢關鍵程式碼。
- **結構化日誌:** 使用 JSON 或鍵值日誌以利解析與分析。
- **全面監控:** 監控延遲、吞吐、錯誤率與資源使用，使用 Prometheus、Grafana、Datadog 等工具。
- **警示:** 為效能回歸與資源耗盡設置警示。

### 語言/框架專屬建議
#### Node.js
- 使用非同步 API；避免阻塞事件迴圈（例如，生產環境中避免使用 `fs.readFileSync`）。
- 對 CPU 密集型任務使用 clustering 或 worker threads。
- 限制同時開啟連線數以避免資源耗盡。
- 對大型檔案或網路資料使用 streams。
- 使用 `clinic.js`、`node --inspect` 或 Chrome DevTools 進行分析。

#### Python
- 使用內建資料結構（`dict`、`set`、`deque`）以提升速度。
- 使用 `cProfile`、`line_profiler` 或 `Py-Spy` 進行分析。
- 對平行處理使用 `multiprocessing` 或 `asyncio`。
- 對於 CPU 密集型程式避免 GIL 瓶頸；可使用 C 擴充或子行程。
- 使用 `lru_cache` 做備忘錄快取（memoization）。

#### Java
- 使用有效的集合（`ArrayList`、`HashMap` 等）。
- 使用 VisualVM、JProfiler 或 YourKit 進行分析。
- 使用執行緒池（`Executors`）管理併發。
- 調整 JVM 參數以優化 heap 與 GC（`-Xmx`、`-Xms`、`-XX:+UseG1GC`）。
- 使用 `CompletableFuture` 進行非同步程式設計。

#### .NET
- 對 I/O 密集型操作使用 `async/await`。
- 使用 `Span<T>` 與 `Memory<T>` 以提高記憶體存取效率。
- 使用 dotTrace、Visual Studio Profiler 或 PerfView 進行分析。
- 對物件與連線進行池化（pooling）以提高效能。
- 對串流資料使用 `IAsyncEnumerable<T>`。

### 常見後端陷阱
- Web 伺服器中使用同步/阻塞 I/O。
- 未對資料庫使用連線池。
- 過度快取或快取敏感/易變資料。
- 忽略非同步程式碼的錯誤處理。
- 未對效能回歸進行監控或警示。

### 後端故障排除
- 使用 flame graph 以視覺化 CPU 使用情況。
- 使用分散式追蹤（OpenTelemetry、Jaeger、Zipkin）追蹤跨服務的請求延遲。
- 使用 heap dump 與記憶體分析器尋找洩漏。
- 記錄慢查詢與慢 API 呼叫以便分析。

---

## 資料庫效能

### 查詢優化
- **索引:** 在經常查詢、過濾或 join 的欄位上建立索引。監控索引使用情況並移除未使用的索引。
- **避免 SELECT *:** 僅選取所需欄位以減少 I/O 與記憶體使用。
- **參數化查詢:** 防止 SQL 注入並改善執行計劃快取。
- **查詢計畫:** 分析並優化查詢執行計畫。在 SQL 資料庫中使用 `EXPLAIN`。
- **避免 N+1 查詢:** 使用 join 或批次查詢以避免循環中重複查詢。
- **限制結果集:** 對大型資料表使用 `LIMIT`/`OFFSET` 或游標。

### 架構設計
- **正規化:** 為減少冗餘而正規化，但對讀取負載高的場景可視需求進行反正規化。
- **資料型別:** 使用最有效率的資料型別並設定適當的約束。
- **分割 (Partitioning):** 對大型資料表進行分割以提升可擴展性與可管理性。
- **歸檔:** 定期歸檔或清理舊資料以保持資料表較小且快速。
- **外鍵:** 使用外鍵保障資料完整性，但在高寫入場景要注意效能折衷。

### 交互 (Transactions)
- **短交易:** 將交易維持在最短時間以降低鎖競爭。
- **隔離級別:** 使用滿足一致性需求的最低隔離級別。
- **避免長時間交易:** 長時間交易會阻塞其他操作並增加死鎖風險。

### 快取與複寫
- **讀取複寫:** 用於擴展讀取密集型負載。監控複寫延遲。
- **快取查詢結果:** 對常存取的查詢結果使用 Redis 或 Memcached。
- **寫入策略:** 根據一致性需求選擇 write-through 或 write-behind 策略。
- **分片 (Sharding):** 將資料分布到多台伺服器以提升可擴展性。

### NoSQL 資料庫
- **根據存取模式設計:** 以所需查詢為中心建模資料。
- **避免熱分片:** 平均分配寫入與讀取。
- **無界成長:** 留意無界陣列或文件導致的成長問題。
- **分片與複寫:** 用於擴展性與可用性。
- **一致性模型:** 了解最終一致性與強一致性的差異並選擇適合的模型。

### 常見資料庫陷阱
- 缺失或未使用的索引。
- 生產查詢中使用 SELECT *。
- 未監控慢查詢。
- 忽視複寫延遲。
- 未歸檔舊資料。

### 資料庫故障排除
- 使用慢查詢日誌識別瓶頸。
- 使用 `EXPLAIN` 分析查詢計畫。
- 監控快取命中/未命中比率。
- 使用資料庫專屬的監控工具（如 pg_stat_statements、MySQL Performance Schema）。

---

## 效能代碼審查檢查表

- [ ] 是否存在明顯的演算法低效率（O(n^2) 或更差）？
- [ ] 資料結構是否適合其用途？
- [ ] 是否存在不必要的計算或重複工作？
- [ ] 是否在適當情況下使用快取，且失效機制處理正確？
- [ ] 資料庫查詢是否已優化、建立索引，且無 N+1 問題？
- [ ] 大型載荷是否已分頁、串流或切塊處理？
- [ ] 是否存在記憶體洩漏或無界資源使用？
- [ ] 網路請求是否已最小化、批次化，並在失敗時重試？
- [ ] 資產是否已優化、壓縮並有效提供？
- [ ] 關鍵路徑是否存在阻塞性操作？
- [ ] 熱路徑中的日誌是否已最小化且具結構化？
- [ ] 性能關鍵的程式碼路徑是否已記錄與測試？
- [ ] 是否對性能敏感的程式碼有自動化測試或基準測試？
- [ ] 是否有針對性能回歸的警示？
- [ ] 是否存在任何反模式（例如 SELECT *, 阻塞 I/O、全域變數）？

---

## 進階主題

### 分析與基準測試
- **分析器:** 使用語言專屬的分析器（Chrome DevTools、Py-Spy、VisualVM、dotTrace 等）找出瓶頸。
- **微基準:** 為關鍵程式路徑撰寫微基準。使用 `benchmark.js`、`pytest-benchmark` 或 Java 的 JMH。
- **A/B 測試:** 透過 A/B 或金絲雀發佈衡量優化的實際影響。
- **持續性效能測試:** 將效能測試整合至 CI/CD，使用 k6、Gatling 或 Locust 等工具。

### 記憶體管理
- **資源清理:** 及時釋放資源（檔案、socket、資料庫連線）。
- **物件池:** 對頻繁建立/銷毀的物件（例如 DB 連線、執行緒）使用池化。
- **堆積監控:** 監控 heap 使用與垃圾回收，並針對工作負載調整 GC 參數。
- **記憶體洩漏:** 使用洩漏偵測工具（Valgrind、LeakCanary、Chrome DevTools）。

### 可擴展性
- **水平擴展:** 設計無狀態服務，使用分片/分區與負載平衡器。
- **自動擴展:** 使用雲端的自動擴展群組並設定合理的閾值。
- **瓶頸分析:** 找出並處理單一故障點。
- **分散式系統:** 使用冪等操作、重試與斷路器設計。

### 安全與效能
- **有效的加密:** 使用硬體加速且由良好維護的加密庫。
- **驗證:** 有效率地驗證輸入；避免在熱路徑中使用複雜正則。
- **速率限制:** 在不損及合法使用者的情況下防護 DoS。

### 行動效能
- **啟動時間:** 延遲載入功能、延後重度工作並最小化初始 bundle 大小。
- **圖片/資產優化:** 使用響應式圖片並壓縮資產以節省行動頻寬。
- **有效存儲:** 使用 SQLite、Realm 或平台最佳化的儲存方案。
- **分析:** 使用 Android Profiler、Instruments（iOS）或 Firebase Performance Monitoring。

### 雲端與 Serverless
- **冷啟動:** 最小化相依並保持函數 warm。
- **資源配置:** 為 Serverless 函數調整記憶體/CPU。
- **託管服務:** 使用託管的快取、佇列與資料庫以提升可擴展性。
- **成本優化:** 將雲端成本視為一項性能指標並持續監控與優化。

---

## 實作範例

### 範例 1：在 JavaScript 中對使用者輸入做防抖
```javascript
// BAD: Triggers API call on every keystroke
input.addEventListener('input', (e) => {
  fetch(`/search?q=${e.target.value}`);
});

// GOOD: Debounce API calls
let timeout;
input.addEventListener('input', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch(`/search?q=${e.target.value}`);
  }, 300);
});
```

### 範例 2：有效的 SQL 查詢
```sql
-- BAD: Selects all columns and does not use an index
SELECT * FROM users WHERE email = 'user@example.com';

-- GOOD: Selects only needed columns and uses an index
SELECT id, name FROM users WHERE email = 'user@example.com';
```

### 範例 3：在 Python 中快取昂貴的運算
```python
# BAD: Recomputes result every time
result = expensive_function(x)

# GOOD: Cache result
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(x):
    ...
result = expensive_function(x)
```

### 範例 4：在 HTML 中延遲載入圖片
```html
<!-- BAD: Loads all images immediately -->
<img src="large-image.jpg" />

<!-- GOOD: Lazy loads images -->
<img src="large-image.jpg" loading="lazy" />
```

### 範例 5：在 Node.js 中的非同步 I/O
```javascript
// BAD: Blocking file read
const data = fs.readFileSync('file.txt');

// GOOD: Non-blocking file read
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  // process data
});
```

### 範例 6：分析 Python 函式
```python
import cProfile
import pstats

def slow_function():
    ...

cProfile.run('slow_function()', 'profile.stats')
p = pstats.Stats('profile.stats')
p.sort_stats('cumulative').print_stats(10)
```

### 範例 7：在 Node.js 中使用 Redis 快取
```javascript
const redis = require('redis');
const client = redis.createClient();

function getCachedData(key, fetchFunction) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (data) return resolve(JSON.parse(data));
      fetchFunction().then(result => {
        client.setex(key, 3600, JSON.stringify(result));
        resolve(result);
      });
    });
  });
}
```

---

## 參考與延伸閱讀
- [Google Web Fundamentals: Performance](https://web.dev/performance/)
- [MDN Web Docs: Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [OWASP: Performance Testing](https://owasp.org/www-project-performance-testing/)
- [Microsoft Performance Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/performance)
- [PostgreSQL Performance Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Python Performance Tips](https://docs.python.org/3/library/profile.html)
- [Java Performance Tuning](https://www.oracle.com/java/technologies/javase/performance.html)
- [.NET Performance Guide](https://learn.microsoft.com/en-us/dotnet/standard/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [k6 Load Testing](https://k6.io/)
- [Gatling](https://gatling.io/)
- [Locust](https://locust.io/)
- [OpenTelemetry](https://opentelemetry.io/)
- [Jaeger](https://www.jaegertracing.io/)
- [Zipkin](https://zipkin.io/)

---

## 結論

效能優化是一個持續的過程。始終量測、分析並反覆優化。使用這些最佳實務、檢查清單與故障排除建議，指導您在開發與程式碼審查中打造高性能、可擴展且高效率的軟體。如果您有新的技巧或經驗分享，請將它們加入此處—讓本指南持續成長！
