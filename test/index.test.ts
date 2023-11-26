import { expect, test } from 'vitest';
import { QueryBuilder, VNDB } from '../src';

const vndb = new VNDB();

test('query builder', () => {
  const query = new QueryBuilder();
  query.and(({ f, or }) => {
    or(() => {
      f('lang').eq.v('en');
      f('lang').eq.v('de');
      f('lang').eq.v('fr');
    });

    f('olang').not.v('ja');
    f('release').eq.and(() => {
      f('released').gte.v('2020-01-01');
      f('anime_id').eq.f('dtag').eq.v('p30');
    });
  });

  const example = [
    'and',
    ['or', ['lang', '=', 'en'], ['lang', '=', 'de'], ['lang', '=', 'fr']],
    ['olang', '!=', 'ja'],
    [
      'release',
      '=',
      [
        'and',
        ['released', '>=', '2020-01-01'],
        ['anime_id', '=', ['dtag', '=', 'p30']]
      ]
    ]
  ];

  expect(query.toArray()).toEqual(example);
});

test('lock proxy', () => {
  const query = new QueryBuilder({ filters: 'some-compact-filter' });
  expect(() => query.f('anime_id')).toThrowError();
});

test('fields as array', async () => {
  const fields = [
    'title',
    'titles.main',
    'titles.title',
    'image.url',
    'developers.original'
  ];
  const query = new QueryBuilder({ fields });
  query.f('id').eq.v('v2713');

  const { results } = await vndb.post.vn(query);
  expect(results[0].title).toBe('Bishoujo');
  expect(results?.[0].developers?.[0].original).toBe('たぬきそふと');
  expect(results?.[0].titles?.[0].title).toBe('微少女');
});
