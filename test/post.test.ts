import { z } from 'zod';
import { expect, test } from 'vitest';
import { QueryBuilder, VNDB } from '../src';

const vndb = new VNDB();

test('search', async () => {
  const options = { results: 3 };
  const sora = await vndb.search('vn', 'Sorairo Sorauta Soranooto', options);
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
  const parser = z.object({
    id: z.string(),
    title: z.string()
  });

  z.array(parser).parse(results);
});

test('POST /ulist', async () => {
  const query = new QueryBuilder({
    user: 'u2',
    fields: ['id', 'vote', 'vn.title'],
    sort: 'vote',
    reverse: true,
    results: 5
  });

  query.f('label').eq.v(7);

  const { results } = await vndb.post.ulist(query);
  const parser = z.object({
    id: z.string().regex(VNDB.regex.id.vn),
    vote: z.union([z.number().int(), z.null()]),
    vn: z.object({
      title: z.string()
    })
  });

  z.array(parser).parse(results);
});
