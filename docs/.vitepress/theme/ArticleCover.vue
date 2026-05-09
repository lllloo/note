<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()

const cover = computed(() => {
  const value = frontmatter.value.cover

  if (!value) return null

  if (typeof value === 'string') {
    return {
      src: value,
      alt: frontmatter.value.coverAlt || frontmatter.value.title || '',
      caption: frontmatter.value.coverCaption || '',
    }
  }

  return {
    src: value.src || value.image,
    alt: value.alt || frontmatter.value.coverAlt || frontmatter.value.title || '',
    caption: value.caption || frontmatter.value.coverCaption || '',
  }
})

const coverSrc = computed(() => {
  const src = cover.value?.src

  if (!src) return ''
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src

  return withBase(src)
})
</script>

<template>
  <figure v-if="coverSrc" class="article-cover">
    <img :src="coverSrc" :alt="cover.alt" decoding="async" fetchpriority="high">
    <figcaption v-if="cover.caption">{{ cover.caption }}</figcaption>
  </figure>
</template>
