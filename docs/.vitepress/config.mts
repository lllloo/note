import { defineConfig } from 'vitepress'

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
                { text: 'Paged.js', link: '/notes/frontend/paged-js' },
                { text: '檔案下載', link: '/notes/frontend/file-download' },
                { text: 'FullCalendar', link: '/notes/frontend/fullcalendar' }
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
              ],
            },
            {
              text: 'TypeScript',
              items: [
                { text: 'JSDoc 型別註解', link: '/notes/typescript/jsdoc' },
              ],
            },
            {
              text: 'CSS',
              items: [
                { text: '換行', link: '/notes/css/newline' },
                { text: '圖片', link: '/notes/css/img' },
                { text: '捲軸', link: '/notes/css/scroller' },
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
            }
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          link: '/guide',
          items: [
            {
              text: 'Markdown',
              link: '/guide/markdown',
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
})
