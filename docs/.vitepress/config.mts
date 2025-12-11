import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Barney's Notes",
  description: '前端開發、技術筆記與學習心得分享。',
  lang: 'zh-TW',
  sitemap: {
    hostname: 'https://bugloop.com',
  },
  head: [
    ['meta', { charset: 'UTF-8' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
    [
      'meta',
      { name: 'description', content: '前端開發、技術筆記與學習心得分享。' },
    ],
    ['meta', { property: 'og:title', content: "Barney's Notes" }],
    [
      'meta',
      {
        property: 'og:description',
        content: '前端開發、技術筆記與學習心得分享。',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://bugloop.com' }],
    ['meta', { property: 'og:image', content: 'https://bugloop.com/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: "Barney's Notes" }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: '前端開發、技術筆記與學習心得分享。',
      },
    ],
    [
      'meta',
      { name: 'twitter:image', content: 'https://bugloop.com/logo.svg' },
    ],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-RJKJTQWD8H',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RJKJTQWD8H');`,
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '筆記', link: '/notes' },
      { text: '疑難雜症', link: '/issues' },
      { text: '指南', link: '/guide' },
    ],

    outline: [2, 3],

    sidebar: {
      '/notes/': [
        {
          text: '筆記總覽',
          link: '/notes',
          items: [
            {
              text: '前端',
              items: [
                {
                  text: '數字/小數點輸入限制',
                  link: '/notes/frontend/input-number',
                },
                { text: '檔案下載', link: '/notes/frontend/file-download' },
                {
                  text: '安全使用 target="_blank"',
                  link: '/notes/frontend/target-blank-security',
                },
                { text: '剪貼簿複製文字', link: '/notes/frontend/clipboard' },
              ],
            },
            {
              text: 'Library',
              items: [
                { text: 'Paged.js', link: '/notes/library/paged-js' },
                { text: 'FullCalendar', link: '/notes/library/fullcalendar' },
              ],
            },
            {
              text: 'JavaScript',
              items: [
                { text: 'Date', link: '/notes/js/date' },
                { text: 'package.js 更新', link: '/notes/js/update' },
                { text: 'Volta', link: '/notes/js/volta' },
                { text: 'cookie', link: '/notes/js/cookie' },
                { text: 'URL query string', link: '/notes/js/URLQueryString' },
                {
                  text: '深拷貝 structuredClone',
                  link: '/notes/js/deep-clone',
                },
              ],
            },
            {
              text: 'TypeScript',
              items: [
                { text: 'JSDoc 型別註解', link: '/notes/typescript/jsdoc' },
                {
                  text: 'Vue 的 JSDoc 型別註解',
                  link: '/notes/typescript/vue-jsdoc',
                },
                {
                  text: 'TS 工具類型',
                  link: '/notes/typescript/utility-types',
                },
              ],
            },
            {
              text: 'CSS',
              items: [
                { text: '換行', link: '/notes/css/newline' },
                { text: '圖片', link: '/notes/css/img' },
                { text: '捲軸', link: '/notes/css/scroller' },
                {
                  text: '最後一行移除下邊框',
                  link: '/notes/css/remove-last-row-border',
                },
              ],
            },
            {
              text: 'Docker',
              items: [{ text: '清理', link: '/notes/docker/clear' }],
            },
            {
              text: 'Git',
              items: [
                { text: '設定', link: '/notes/git/setting' },
                { text: '指令', link: '/notes/git/command' },
              ],
            },
          ],
        },
      ],
      '/issues/': [
        {
          text: '疑難雜症',
          link: '/issues',
          items: [
            {
              text: 'Content-Disposition 無法取得',
              link: '/issues/content-disposition',
            },
            {
              text: '圖片上傳後旋轉',
              link: '/issues/image-orientation',
            },
            {
              text: 'iOS 圖片高度異常',
              link: '/issues/image-height',
            },
            {
              text: 'Line 無法跳轉 Blob URL',
              link: '/issues/line-browser-blob-url',
            },
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          link: '/guide',
          items: [
            {
              text: 'Awesome Copilot',
              items: [
                {
                  text: 'GitHub Copilot 自訂指令',
                  items: [
                    {
                      text: 'Instructions',
                      link: '/guide/instructions.instructions',
                    },
                    {
                      text: 'Prompt',
                      link: '/guide/prompt.instructions',
                    },
                  ],
                },
                {
                  text: '通用自訂指令',
                  items: [
                    {
                      text: '約束 Copilot 的提示',
                      link: '/guide/taming-copilot.instructions',
                    },
                  ],
                },
                {
                  text: '特定自訂指令',
                  items: [
                    {
                      text: 'Markdown',
                      link: '/guide/markdown.instructions',
                    },
                    {
                      text: 'Docker',
                      link: '/guide/containerization-docker-best-practices.instructions',
                    },
                    {
                      text: 'Vue',
                      link: '/guide/vuejs3.instructions',
                    },
                    {
                      text: 'Typescript',
                      link: '/guide/typescript-5-es2022.instructions',
                    },
                    {
                      text: 'GitHub Actions',
                      link: '/guide/github-actions-ci-cd-best-practices.instructions',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Conventional Commits',
              link: '/guide/conventional-commits',
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/lllloo/note' }],

    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/lllloo/note/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
      },
    },
    search: {
      provider: 'local',
    },
  },
  vite: {
    plugins: [llmstxt()],
  },
  markdown: {
    // https://github.com/vuejs/vitepress/discussions/3724
    // 不想在任何地方的內聯程式碼中使用 Vue 插值
    config(md) {
      const defaultCodeInline = md.renderer.rules.code_inline!
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        tokens[idx].attrSet('v-pre', '')
        return defaultCodeInline(tokens, idx, options, env, self)
      }
    },
  },
})
