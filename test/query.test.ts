import { expect, test } from 'vitest';
import { VNDB, QueryBuilder } from '../src';
// import config from '../config.json' assert { type: 'json' };

const vndb = new VNDB();

test('query builder', () => {
    const query = new QueryBuilder<'vn'>();
    query
        .and(({ f, or }) => {
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
            ['or',
                ['lang', '=', 'en'],
                ['lang', '=', 'de'],
                ['lang', '=', 'fr']
            ],
            ['olang', '!=', 'ja'],
            ['release', '=', ['and',
                    ['released', '>=', '2020-01-01'],
                    ['anime_id', '=', ['dtag', '=', 'p30']]
                ]
            ]
        ];

    expect(query.toArray()).toEqual(example);
});

test('lock proxy', () => {
    const query = new QueryBuilder<'vn'>({ filters: 'some-compact-filter' });
    expect(() => query.f('anime_id')).toThrowError();
})

test.skip('query', async () => {
    const query = new QueryBuilder<'vn'>({ fields: 'title', results: 5 });
    query
        .and(({ f, or }) => {
            or(() => {
                f('lang').eq.v('en');
                f('lang').eq.v('de');
                f('lang').eq.v('fr');
            });
            f('olang').not.v('ja');
        })
    
    console.log(await vndb.query(query));
})