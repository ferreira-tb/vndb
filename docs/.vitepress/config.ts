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
			{
				text: 'Guide',
				link: '/api/introduction',
				activeMatch: '/api/introduction'
			},
			{
				text: 'Playground',
				link: 'https://jsfiddle.net/ferreiratb/0Lezvkfa/27/'
			}
		],

		sidebar: {
			'/': [
				{
					text: 'Getting Started',
					collapsed: false,
					items: [
						{ text: 'Introduction ', link: '/api/introduction' },
						{
							text: 'Troubleshooting',
							link: '/api/troubleshooting'
						}
					]
				},
				{
					text: 'Essentials',
					collapsed: false,
					items: [
						{ text: 'Endpoints', link: '/api/endpoints' },
						{ text: 'Query Builder', link: '/api/query-builder' }
					]
				}
			]
		},

		editLink: {
			pattern:
				'https://github.com/ferreira-tb/vndb-query/edit/main/docs/:path'
		},

		search: {
			provider: 'local'
		},

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/ferreira-tb/vndb-query'
			}
		],

		footer: {
			copyright:
				'Copyright © 2023 <a href="https://github.com/ferreira-tb">Andrew Ferreira</a>'
		}
	}
});
