import { defineConfig } from 'vitepress';

export default defineConfig({
    base: '/vndb-query/',
    title: 'VNDB Query',
    description: 'VNDB HTTPS API with custom query builder',
    lang: 'en',
    lastUpdated: true,

    head: [
        ['script', { src: 'https://unpkg.com/vndb-query/dist/index.umd.js' }]
    ],

    themeConfig: {
        nav: [
            { text: 'Guide', link: '/api/getting-started', activeMatch: '/api/getting-started' }
        ],
        
        sidebar: {
            '/': [
                {
                    text: 'Guide',
                    collapsed: false,
                    items: [
                        { text: 'Getting Started', link: '/api/getting-started' },
                        { text: 'Endpoints', link: '/api/endpoints' },
                        { text: 'Query Builder', link: '/api/query-builder' },
                        { text: 'Troubleshooting', link: '/api/troubleshooting' }
                    ]
                }
            ]
        },

        editLink: {
            pattern: 'https://github.com/ferreira-tb/vndb-query/edit/main/docs/:path'
        },

        search: {
            provider: 'local'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ferreira-tb/vndb-query' }
        ],

        footer: {
            copyright: 'Copyright © 2023 <a href="https://github.com/ferreira-tb">Andrew Ferreira</a>'
        }
    }
});