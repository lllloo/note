# Axios 封裝

## 安裝

```bash
npm install axios
```

## 完整封裝

### `src/utils/request.ts`

建立 axios instance，統一處理 token 注入與錯誤回應。

```ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 請求攔截器：自動帶入 token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 回應攔截器：統一錯誤處理
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return Promise.reject(error)

    const status = error.response?.status
    const message = error.response?.data?.message ?? '請求失敗'

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      console.error('無權限存取')
    } else if (status >= 500) {
      console.error('伺服器錯誤，請稍後再試')
    } else {
      console.error(message)
    }

    return Promise.reject(error)
  }
)

// 進行中的請求快取（防連點）
const pendingRequests = new Map<string, Promise<unknown>>()

function getRequestKey(config: AxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`
}

export function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const key = getRequestKey(config)

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>
  }

  const promise = instance(config)
    .then((res) => res as T)
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, promise)
  return promise
}
```

### `src/composables/useRequest.ts`

提供 `loading`、`error`、`data` 狀態，並在元件卸載時自動取消請求。

```ts
import { ref, onUnmounted } from 'vue'
import { request } from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'

export function useRequest<T>(config: AxiosRequestConfig) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const controller = new AbortController()

  onUnmounted(() => {
    controller.abort()
  })

  async function execute() {
    if (loading.value) return // 防止連點
    loading.value = true
    error.value = null
    try {
      data.value = await request<T>({
        ...config,
        signal: controller.signal,
      })
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
```

## 使用方式

### 直接呼叫（防連點）

```ts
import { request } from '@/utils/request'

interface User {
  id: number
  name: string
}

const getUser = (id: number) =>
  request<User>({ method: 'get', url: `/users/${id}` })

const createUser = (data: Omit<User, 'id'>) =>
  request<User>({ method: 'post', url: '/users', data })
```

### 在元件中使用（含 loading 狀態 + 自動取消）

```vue
<script setup lang="ts">
import { useRequest } from '@/composables/useRequest'

const { data, loading, error, execute } = useRequest({
  method: 'post',
  url: '/api/submit',
  data: { name: 'Barney' },
})
</script>

<template>
  <div>
    <p v-if="error">{{ error.message }}</p>
    <p v-if="data">{{ data }}</p>
    <button :disabled="loading" @click="execute">
      {{ loading ? '送出中...' : '送出' }}
    </button>
  </div>
</template>
```
