/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
	entryPoints: ['./src/index.ts'],
	out: 'docs/.vitepress/dist/api',
	includeVersion: true,
	excludePrivate: true,
	excludeProtected: true,
	githubPages: false,
	titleLink: 'https://tb.dev.br/vndb-query/'
};
