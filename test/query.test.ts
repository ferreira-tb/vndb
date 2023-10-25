import { expect, test } from 'vitest';
import { VNDB, QueryBuilder } from '../src';

const vndb = new VNDB();

test('search', async () => {
	const sora = await vndb.search('vn', 'Sorairo Sorauta Soranooto');
	expect(sora.results.some((vn) => vn.id === 'v21668')).toBe(true);
});

test('POST /vn', async () => {
	const query = new QueryBuilder({ fields: 'title', results: 5 });
	query.and(({ f, or }) => {
		or(() => {
			f('lang').eq.v('en');
			f('lang').eq.v('de');
			f('lang').eq.v('fr');
		});
		f('olang').not.v('ja');
	});

	const { results } = await vndb.vn(query);
	expect(results).toHaveLength(5);
});
