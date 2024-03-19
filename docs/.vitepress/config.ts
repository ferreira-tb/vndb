import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/vndb/',
  title: '@tb-dev/vndb',
  description: 'Custom query builder for VNDB',
  lang: 'en',
  lastUpdated: true,

  sitemap: {
    hostname: 'https://tb.dev.br/vndb'
  },

  head: [
    ['link', { rel: 'icon', href: '/vndb/favicon.ico' }],
    [
      'meta ',
      {
        name: 'google-site-verification',
        content: 'FpKCfhe8tgbogFn89w4fUPpqlYF_Hcrv7h6GpUL8rdE'
      }
    ]
  ],

  themeConfig: {
    logo: '/favicon.ico',
    nav: [
      {
        text: 'API',
        link: 'https://tb.dev.br/vndb/api/index.html'
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction ', link: '/' },
            {
              text: 'Troubleshooting',
              link: '/guide/troubleshooting'
            }
          ]
        },
        {
          text: 'Essentials',
          collapsed: false,
          items: [
            { text: 'Endpoints', link: '/guide/endpoints' },
            { text: 'Query Builder', link: '/guide/query-builder' }
          ]
        }
      ]
    },

    editLink: {
      pattern: 'https://github.com/ferreira-tb/vndb/edit/main/docs/:path'
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ferreira-tb/vndb'
      }
    ],

    footer: {
      copyright:
        'Copyright © 2023 <a href="https://github.com/ferreira-tb">Andrew Ferreira</a>'
    }
  }
});
