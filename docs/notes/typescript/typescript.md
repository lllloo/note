# TypeScript 工具型別簡介與範例

## Partial

將型別 T 的所有屬性變為可選 (optional)。

```ts
type Person = { name: string; age: number; gender: string }
type PartialPerson = Partial<Person> // { name?: string; age?: number; gender?: string }
```

## Required

將型別 T 的所有屬性變為必填 (required)。

```ts
type Person = { name?: string; age?: number; gender?: string }
type RequiredPerson = Required<Person> // { name: string; age: number; gender: string }
```

## Record

建立一個以 K 為鍵、T 為值的物件型別。

```ts
type Score = Record<string, number>
// { [key: string]: number }
```

## Pick

從型別 T 中挑選指定屬性 K，組成新型別。

```ts
type Person = { name: string; age: number; gender: string }
type PersonName = Pick<Person, 'name'> // { name: string }
```

## Omit

從型別 T 中移除指定屬性 K，組成新型別。

```ts
type Person = { name: string; age: number; gender: string }
type PersonWithoutAge = Omit<Person, 'age'> // { name: string; gender: string }
```

## Exclude

從聯集型別 T 中排除 U 型別。

```ts
type T = 'a' | 'b' | 'c'
type Excluded = Exclude<T, 'a'> // 'b' | 'c'
```

## Extract

從聯集型別 T 中提取 U 型別。

```ts
type T = 'a' | 'b' | 'c'
type Extracted = Extract<T, 'a' | 'b'> // 'a' | 'b'
```

## 參考資料

- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
