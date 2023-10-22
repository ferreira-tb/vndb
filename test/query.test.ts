import { expect, test } from 'vitest';
import { VNDB, QueryBuilder } from '../src';

const vndb = new VNDB();

test('stats', async () => {
    const query = new QueryBuilder<'vn'>();
    query
        .and(({ f, or }) => {
            or(() => {
                f('lang').eq.v('en');
                f('lang').eq.v('de');
                f('lang').eq.v('fr');
            });
        })

    console.log(query.toJSON(4));
});

test('lock proxy', () => {
    const query = new QueryBuilder<'vn'>({ filters: 'some-compact-filter' });
    expect(() => query.f('anime_id')).toThrowError();
})