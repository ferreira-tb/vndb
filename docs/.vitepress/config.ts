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
				link: '/guide/introduction',
				activeMatch: '/guide/introduction'
			},
			{
				text: 'Guide',
				link: '/api/index.html'
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
						{ text: 'Introduction ', link: '/guide/introduction' },
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
