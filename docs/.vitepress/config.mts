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
      { text: 'AI 應用', link: '/ai/' },
      { text: '筆記', link: '/notes/' },
      { text: '疑難雜症', link: '/issues/' },
    ],

    outline: [2, 3],

    sidebar: {
      '/notes/': [
        {
          text: '筆記總覽',
          link: '/notes/',
          items: [
            {
              text: '前端',
              items: [
                {
                  text: '數字/小數點輸入限制',
                  link: '/notes/frontend/input-number',
                },
                { text: '檔案下載', link: '/notes/frontend/file-download' },
                { text: '剪貼簿複製文字', link: '/notes/frontend/clipboard' },
              ],
            },
            {
              text: '安全',
              items: [
                {
                  text: 'Token 機制 (Access/Refresh)',
                  link: '/notes/auth/token-refresh',
                },
                {
                  text: '安全使用 target="_blank"',
                  link: '/notes/auth/target-blank-security',
                },
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
                { text: '數字計算與格式化', link: '/notes/js/number' },
                { text: 'cookie', link: '/notes/js/cookie' },
                { text: 'URL query string', link: '/notes/js/URLQueryString' },
                {
                  text: '深拷貝 structuredClone',
                  link: '/notes/js/deep-clone',
                },
              ],
            },
            {
              text: 'npm',
              items: [
                { text: '套件更新與檢查', link: '/notes/npm/update' },
                { text: 'Volta', link: '/notes/npm/volta' },
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
          link: '/issues/',
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
      '/ai/': [
        {
          text: 'AI 應用',
          link: '/ai/',
          items: [
            {
              text: '使用指南',
              items: [
                { text: '符號連結建立指令', link: '/ai/guides/symbolic-link' },
                { text: 'AGENTS.md 統一指令標準', link: '/ai/guides/agents-md' },
                { text: 'Skills 安裝指南', link: '/ai/guides/install-skills' },
                { text: 'QA 系統的聊天回覆', link: '/ai/guides/rag-chat' },
              ],
            },
            { text: 'Awesome Copilot', link: '/ai/awesome-copilot' },
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
