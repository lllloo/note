# QA 系統的 RAG 聊天回覆

本文介紹如何在 QA 系統中使用 RAG（Retrieval-Augmented Generation）架構，實現基於知識庫的聊天回覆功能。

[[toc]]

## RAG 架構概念

### 什麼是 RAG

RAG（Retrieval-Augmented Generation，檢索增強生成）是一種結合「資訊檢索」與「文字生成」的 AI 架構。透過先從知識庫中檢索相關文件，再將檢索結果作為上下文提供給 LLM，讓模型根據實際資料生成回覆，而非僅依賴訓練時學到的知識。

### 核心流程

RAG 的運作可拆解為四個階段：

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

## 實作指南

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

## 聊天回覆的提示詞設計

### System Prompt 設計原則

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

### 將檢索結果注入 Prompt

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

## 參考資源

- [LangChain.js 官方文件](https://js.langchain.com/docs/introduction/)
- [LlamaIndex.TS 官方文件](https://ts.llamaindex.ai/)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [Chroma 官方文件](https://docs.trychroma.com/)
- [RAG 論文 - Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
