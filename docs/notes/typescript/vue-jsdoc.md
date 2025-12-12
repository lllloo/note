# JSDoc 與 TypeScript 型別註解範例

這份文件說明如何在 Vue 專案中，利用 JSDoc 加上型別註解。

[[toc]]

## ref

以下範例展示如何在 ref 變數上使用 JSDoc 型別註解：

```ts
/** @type {import('vue').Ref<string>} */
const name = ref('')
```

物件型別

```ts
/** @type {import('vue').Ref<{id: number, name: string}>} */
const user = ref({ id: 0, name: '' })
```

有時候你會遇到變數型別不明確，想要用 JSDoc 型別斷言搭配 ref，例如：

```ts
/** @type any */
let x = ''
// 將 x 斷言為 string 型別後傳給 ref
const y = ref(/** @type {string} */ x)
console.log(y.value) // y.value 型別會被推斷為 string
```

這種寫法常見於純 JavaScript 專案，利用 JSDoc 型別斷言讓 TypeScript 能正確推斷型別。

## computed

以下範例展示如何在 computed 屬性上使用 JSDoc 型別註解：

```ts
import { computed } from 'vue'

/** @type {import('vue').ComputedRef<number>} */
const count = computed(() => 123)
```

物件型別

```ts
/** @type {import('vue').ComputedRef<{id: number, name: string}>} */
const user = computed(() => ({ id: 1, name: 'Alice' }))
```

## props

以下範例展示如何在 defineProps 內使用 JSDoc 註解 props 型別：

```ts
const props = defineProps({
  list: {
    /** @type {import('vue').PropType<{id: number, name: string }[]>} */
    type: Array,
    default: () => [],
  },
})
```

## 參考資料

- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
- [TypeScript without TypeScript -- JSDoc superpowers](https://fettblog.eu/typescript-jsdoc-superpowers/)
- [Boost Your JavaScript with JSDoc Typing](https://dev.to/samuel-braun/boost-your-javascript-with-jsdoc-typing-3hb3)
