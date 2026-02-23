# Nuxt 4 Data Fetching 封裝

Nuxt 提供 `useFetch` 與 `useAsyncData` 兩個 Composable，內建 SSR 支援、快取與去重複。

## 完整封裝

### `utils/api.ts`

用於非元件環境（Pinia store、server routes、事件處理），不依賴 Composable 生命週期。

```ts
export const api = $fetch.create({
  baseURL: useRuntimeConfig().public.apiBase,
  onRequest({ options }) {
    const token = useCookie('token').value
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  },
  onResponseError({ response }) {
    const status = response.status
    const message = response._data?.message ?? '請求失敗'

    if (status === 401) {
      navigateTo('/login')
      return
    }

    if (status === 403) {
      throw createError({ statusCode: 403, message: '無權限存取' })
    }

    if (status >= 500) {
      throw createError({ statusCode: status, message: '伺服器錯誤，請稍後再試' })
    }

    throw createError({ statusCode: status, message })
  },
})
```

### `composables/useApi.ts`

用於元件中，內建 SSR、快取、Token 注入與統一錯誤處理。

```ts
import type { UseFetchOptions } from 'nuxt/app'

export function useApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  return useFetch<T>(url, {
    baseURL: useRuntimeConfig().public.apiBase,
    headers: useRequestHeaders(['cookie']),
    onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },
    onResponseError({ response }) {
      const status = response.status
      const message = response._data?.message ?? '請求失敗'

      if (status === 401) {
        navigateTo('/login')
        return
      }

      if (status === 403) {
        throw createError({ statusCode: 403, message: '無權限存取' })
      }

      if (status >= 500) {
        throw createError({ statusCode: status, message: '伺服器錯誤，請稍後再試' })
      }

      throw createError({ statusCode: status, message })
    },
    ...options,
  })
}
```

### `composables/useApiOnce.ts`

防止連點：相同 `key` 的請求在完成前不會重複送出。

```ts
export function useApiOnce<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: Parameters<typeof useAsyncData>[2] = {}
) {
  return useAsyncData<T>(key, fetcher, {
    lazy: false,
    dedupe: 'defer', // 相同 key 的請求共用，不重複發送
    ...options,
  })
}
```

## 使用方式

### 元件中取得資料（自動執行）

```vue
<script setup lang="ts">
interface Post {
  id: number
  title: string
}

const { data: posts, error } = await useApi<Post[]>('/api/posts')
</script>

<template>
  <div>
    <p v-if="error">{{ error.message }}</p>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
  </div>
</template>
```

### 元件中手動觸發（防連點 + loading 狀態）

```vue
<script setup lang="ts">
const { data, status, execute } = useApiOnce(
  'create-post',
  () => api<Post>('/posts', { method: 'POST', body: { title: '新文章' } }),
  { immediate: false }
)

// status: 'idle' | 'pending' | 'success' | 'error'
</script>

<template>
  <button :disabled="status === 'pending'" @click="execute">
    {{ status === 'pending' ? '送出中...' : '送出' }}
  </button>
</template>
```

### 非元件環境（Pinia store）

```ts
// stores/post.ts
export const usePostStore = defineStore('post', () => {
  async function createPost(title: string) {
    const result = await api<Post>('/posts', {
      method: 'POST',
      body: { title },
    })
    return result
  }

  return { createPost }
})
```
