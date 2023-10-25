/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
	entryPoints: ['./src/index.ts'],
	out: 'docs/.vitepress/dist/api',
	excludePrivate: true,
	excludeProtected: true,
	githubPages: false
};