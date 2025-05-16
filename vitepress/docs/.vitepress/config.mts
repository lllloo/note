import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Barney's Notes",
  description: "A Note Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/Notes' },
    ],

    sidebar: [
      {
        text: 'Notes',
        link: '/Notes' ,
        items: [
          {
            text: 'Git',
            items: [
              { text: '設定', link: '/notes/git/setting' },
              { text: '指令', link: '/notes/git/command' },
            ]
          }
        ]
      },
      {
        text: 'Md',
        items: [
          {
            text: '指南',
            link: '/md/md-style-guide',
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
