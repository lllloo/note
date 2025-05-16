import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Barney's Notes",
  description: "A Note Site",
  lang: 'zh-TW',
  head: [
    ['meta', { charset: 'UTF-8' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-RJKJTQWD8H' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RJKJTQWD8H');`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes' },
      { text: 'Guide', link: '/guide' }
    ],

    sidebar: [
      {
        text: 'Notes',
        link: '/notes' ,
        items: [
          {
            text: 'Git',
            items: [
              { text: '設定', link: '/notes/git/setting' },
              { text: '指令', link: '/notes/git/command' },
            ]
          },
          {
            text: 'Css',
            items: [
              { text: '換行', link: '/notes/css/newline' },
            ]
          }
        ]
      }
      // {
      //   text: 'Md',
      //   items: [
      //     {
      //       text: '指南',
      //       link: '/md/md-style-guide',
      //     }
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lllloo/note' }
    ],

    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/lllloo/note/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    search: {
      provider: 'local'
    },
  }
})
