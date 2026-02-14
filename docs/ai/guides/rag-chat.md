# QA 系統的聊天回覆

本文介紹 QA 系統中常見的聊天回覆方案，由簡單到複雜，幫助你根據場景選擇合適的做法。

[[toc]]

## 方案總覽

| 方案 | 每次查詢成本 | 實作複雜度 | 回覆彈性 | 適合規模 |
| --------------- | ------- | ----- | ---- | ---------- |
| 直接塞 Prompt | 高 | 最低 | 高 | < 200 條 |
| 直接塞 + Cache | 中低 | 最低 | 高 | < 200 條 |
| Embedding 比對 | 最低 | 低 | 低 | 不限 |
| 分類器 + 規則 | 最低 | 中 | 最低 | 類別固定 |
| RAG | 低 | 中 | 高 | 不限 |
| Fine-tuning | 低 | 高 | 中 | QA 穩定不變 |

### 如何選擇

| 條件 | 建議方案 |
| ------------------------------ | --------------- |
| QA < 200 條，快速上線 | 直接塞 Prompt |
| QA < 200 條，查詢頻繁 | 直接塞 + Cache |
| 只需回傳固定答案，不需改寫 | Embedding 比對 |
| 問題類型固定且有限 | 分類器 + 規則 |
| QA 200–1000 條，需要語意理解 | RAG |
| QA > 1000 條 | RAG |
| QA 穩定不變，需統一風格 | Fine-tuning |

### Token 消耗比較

以 **200 條 QA**（每條約 100 tokens）、**每天 100 次查詢**為例：

**直接塞 Prompt**：每次送全部 QA

```text
每次 input = 200 × 100 = 20,000 tokens
每天 input = 20,000 × 100 = 2,000,000 tokens
```

**RAG**：每次只送 top 5 條相關 QA

```text
每次 input = 5 × 100 = 500 tokens
每天 input = 500 × 100 = 50,000 tokens
```

RAG 的 input token 消耗約為直接塞 Prompt 的 **2.5%**。QA 越多、查詢越頻繁，差距越大。反過來說，QA 少於 50 條且查詢量低的話，直接塞 Prompt 的成本差異不大，省下的架構複雜度更值得。

## 直接塞 Prompt

最簡單的做法：把所有 QA 問答對放進 system prompt，讓 LLM 直接比對回覆。

- **優點**：幾行程式就搞定，不需要向量資料庫等基礎設施
- **缺點**：受 context window 限制，QA 太多塞不下；所有 QA 都送進去，token 費用高
- **適合**：QA 數量少（< 200 條）、快速 MVP

```js
import OpenAI from 'openai'

const openai = new OpenAI()

// QA 清單
const qaList = [
  { q: '如何重設密碼？', a: '請至「設定 > 帳號安全」點擊「忘記密碼」。' },
  { q: '退貨流程是什麼？', a: '下單後 7 天內可至「訂單列表」申請退貨。' },
  // ...更多 QA
]

// 將 QA 清單格式化為文字
const qaText = qaList.map((item) => `Q: ${item.q}\nA: ${item.a}`).join('\n\n')

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content:
        `你是客服助理，請根據以下 QA 清單回答使用者問題。` +
        `如果清單中沒有相關答案，請回覆「很抱歉，目前無法回答此問題」。\n\n${qaText}`,
    },
    { role: 'user', content: '我想退貨' },
  ],
})

console.log(response.choices[0].message.content)
```

## 直接塞 Prompt + Prompt Caching

與上面相同做法，但利用 API 的 Prompt Caching 機制降低成本。重複的 system prompt 部分會自動快取，後續請求只需支付折扣價：

| 平台 | 快取折扣 |
| --------- | -------------------- |
| OpenAI | cached input 便宜 50% |
| Anthropic | cached input 便宜 90% |

不需要改程式碼，只要確保每次請求的 system prompt 內容相同，API 就會自動快取。Anthropic 幾乎等於打一折，非常適合 QA 清單固定的場景。

## Embedding 直接比對

用 embedding 計算使用者問題與 QA 問題的相似度，直接回傳最相似的答案，完全不經過 LLM。

```text
使用者問題 → embedding → 比對 QA 問題向量 → 回傳對應答案
```

- **優點**：成本最低（只需 embedding 費用）、速度最快
- **缺點**：無法整合多條 QA 回覆、答案不能改寫或補充
- **適合**：標準客服問答、FAQ 機器人

```js
import OpenAI from 'openai'

const openai = new OpenAI()

const qaList = [
  { q: '如何重設密碼？', a: '請至「設定 > 帳號安全」點擊「忘記密碼」。' },
  { q: '退貨流程是什麼？', a: '下單後 7 天內可至「訂單列表」申請退貨。' },
]

// 預先計算所有 QA 問題的向量（只需做一次）
async function embedTexts(texts) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  })
  return res.data.map((d) => d.embedding)
}

const qaEmbeddings = await embedTexts(qaList.map((item) => item.q))

// 計算餘弦相似度
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// 查詢
async function findAnswer(question) {
  const [questionEmbedding] = await embedTexts([question])
  const scores = qaEmbeddings.map((emb, i) => ({
    index: i,
    score: cosineSimilarity(questionEmbedding, emb),
  }))
  scores.sort((a, b) => b.score - a.score)
  return qaList[scores[0].index].a
}

console.log(await findAnswer('我想退貨'))
```

## 分類器 + 規則回覆

用分類模型把問題分到類別，直接回傳預設答案，不需要 LLM。

```text
使用者問題 → 分類模型 → 類別 A → 回傳預設答案 A
```

- **優點**：成本最低、速度最快、回覆完全可控
- **缺點**：無法處理未知問題、需要訓練分類器、彈性最差
- **適合**：問題類型固定且有限的場景

## RAG（檢索增強生成）

RAG（Retrieval-Augmented Generation）結合「資訊檢索」與「文字生成」，先從知識庫中檢索相關文件，再將檢索結果作為上下文提供給 LLM 生成回覆。

### 核心流程

```text
文件切割 → 向量嵌入 → 檢索 → 增強生成
```

1. **文件切割（Chunking）**：將原始文件拆分成適當大小的片段
2. **向量嵌入（Embedding）**：使用 Embedding 模型將文字片段轉換為向量，存入向量資料庫
3. **檢索（Retrieval）**：根據使用者問題，從向量資料庫中找出最相關的文件片段
4. **增強生成（Augmented Generation）**：將檢索到的片段與使用者問題一起送入 LLM，生成回覆

### 與純 LLM 回覆的差異

| 比較項目 | 純 LLM 回覆 | RAG 回覆 |
| -------- | --------------- | --------------- |
| 知識來源 | 模型訓練資料 | 即時檢索的外部文件 |
| 時效性 | 受限於訓練截止日期 | 可隨時更新知識庫 |
| 幻覺風險 | 較高，可能編造答案 | 較低，基於實際文件回覆 |
| 可追溯性 | 無法追溯來源 | 可標示引用來源 |
| 領域適用 | 通用知識 | 可針對特定領域客製化 |

### 文件預處理與切割策略

文件切割是 RAG 品質的關鍵。常見的切割參數：

- **Chunk Size**：每個片段的大小，通常 200–1000 tokens
- **Overlap**：相鄰片段的重疊區域，通常為 chunk size 的 10%–20%

```js
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
  separators: ['\n\n', '\n', '。', '，', ' '],
})

const chunks = await splitter.splitDocuments(documents)
```

切割策略的選擇建議：

- **固定大小切割**：簡單直接，適合結構統一的文件
- **遞迴字元切割**：按分隔符號層級切割，保留語意完整性
- **語意切割**：根據語意相似度分段，品質最好但計算成本較高

### 向量資料庫選型

| 資料庫 | 特點 | 適用場景 |
| -------- | -------------------- | ---------------------- |
| Chroma | 輕量、易上手、支援本地部署 | 開發測試、小型專案 |
| Pinecone | 全託管、高效能、自動擴展 | 生產環境、大規模應用 |
| Qdrant | 開源、支援過濾、豐富的 API | 需要進階過濾的場景 |
| Weaviate | 開源、支援混合搜尋 | 需要關鍵字 + 語意混合搜尋 |

### 檢索策略

**相似度搜尋**是最基礎的檢索方式，透過計算查詢向量與文件向量的餘弦相似度來排序結果：

```js
const results = await vectorStore.similaritySearch(query, 5)
```

**混合搜尋（Hybrid Search）** 結合關鍵字搜尋與語意搜尋，提升檢索準確度：

```js
import { EnsembleRetriever } from 'langchain/retrievers/ensemble'

// 語意檢索
const vectorRetriever = vectorStore.asRetriever({ k: 5 })

// 混合檢索（結合多個 retriever）
const ensembleRetriever = new EnsembleRetriever({
  retrievers: [vectorRetriever],
  weights: [1.0],
})
```

### 完整 RAG Chain 範例

以下使用 LangChain.js 建構一個完整的 RAG QA 系統：

```js
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { RetrievalQAChain } from 'langchain/chains'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'

// 1. 載入文件
const loader = new DirectoryLoader('./knowledge_base', {
  '.md': (path) => new TextLoader(path),
})
const documents = await loader.load()

// 2. 切割文件
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
})
const chunks = await splitter.splitDocuments(documents)

// 3. 建立向量資料庫
const embeddings = new OpenAIEmbeddings()
const vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
  collectionName: 'knowledge_base',
})

// 4. 建立 RAG Chain
const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
const qaChain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever({ k: 5 }), {
  returnSourceDocuments: true,
})

// 5. 查詢
const result = await qaChain.invoke({ query: '如何設定 Docker Compose？' })
console.log(result.text)
```

### 提示詞設計

好的 system prompt 能有效引導 LLM 根據檢索結果回覆，避免幻覺：

```text
你是一個專業的客服助理，負責根據提供的參考資料回答使用者問題。

規則：
1. 僅根據「參考資料」中的內容回答問題
2. 如果參考資料中沒有相關資訊，明確告知使用者「目前知識庫中沒有相關資料」
3. 回答時引用資料來源，方便使用者查閱原始文件
4. 使用繁體中文回覆
5. 保持回答簡潔、結構清晰
```

使用模板將檢索到的文件片段嵌入 prompt：

```js
import { ChatPromptTemplate } from '@langchain/core/prompts'

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `你是一個專業的 QA 助理。請根據以下參考資料回答使用者問題。

參考資料：
{context}

規則：
- 僅根據參考資料回答，不要編造資訊
- 如果資料不足以回答，請誠實告知
- 回答時標示引用來源`,
  ],
  ['human', '{question}'],
])
```

### 處理無相關文件的回退策略

當檢索不到足夠相關的文件時，應有明確的處理邏輯：

```js
async function qaWithFallback(query, vectorStore, llm, threshold = 0.5) {
  // 檢索相關文件並取得分數
  const docsWithScores = await vectorStore.similaritySearchWithScore(query, 5)

  // 過濾低相關性結果
  const relevantDocs = docsWithScores
    .filter(([, score]) => score >= threshold)
    .map(([doc]) => doc)

  if (relevantDocs.length === 0) {
    return {
      answer:
        '抱歉，目前知識庫中沒有與您問題相關的資料。建議您：\n' +
        '1. 嘗試使用不同的關鍵字提問\n' +
        '2. 聯繫客服人員取得進一步協助',
      sources: [],
    }
  }

  // 有相關文件時，正常執行 RAG
  const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n')
  const response = await llm.invoke(
    await promptTemplate.format({ context, question: query })
  )

  return {
    answer: response.content,
    sources: relevantDocs.map((doc) => doc.metadata.source),
  }
}
```

### 多輪對話的上下文管理

在多輪對話中，需要維護歷史訊息以保持對話連貫性：

```js
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { BufferWindowMemory } from 'langchain/memory'

// 使用視窗記憶體，保留最近 5 輪對話
const memory = new BufferWindowMemory({
  k: 5,
  memoryKey: 'chat_history',
  returnMessages: true,
  outputKey: 'answer',
})

const qaChain = ConversationalRetrievalQAChain.fromLLM(
  llm,
  vectorStore.asRetriever(),
  { memory, returnSourceDocuments: true }
)

// 多輪對話
const response1 = await qaChain.invoke({ question: 'RAG 是什麼？' })
const response2 = await qaChain.invoke({ question: '它和 fine-tuning 有什麼差異？' })
```

## Fine-tuning

把 QA 資料微調進模型，推論時不需要額外塞 context。

- **優點**：推論時 input tokens 最少、回覆風格一致
- **缺點**：訓練成本高、更新 QA 要重新訓練、幻覺難控制
- **適合**：QA 穩定不常變動、需要統一語氣風格的場景

## 參考資源

- [LangChain.js 官方文件](https://js.langchain.com/docs/introduction/)
- [LlamaIndex.TS 官方文件](https://ts.llamaindex.ai/)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [Chroma 官方文件](https://docs.trychroma.com/)
- [RAG 論文 - Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
