import { expect, test } from 'vitest';
import { VNDB, QueryBuilder } from '../src';

const vndb = new VNDB();

test('POST /vn', async () => {
    const query = new QueryBuilder({ fields: 'title', results: 5 });
    query
        .and(({ f, or }) => {
            or(() => {
                f('lang').eq.v('en');
                f('lang').eq.v('de');
                f('lang').eq.v('fr');
            });
            f('olang').not.v('ja');
        })
    
        console.log(query.toArray());
    const { results } = await vndb.vn(query);
    expect(results).toHaveLength(5);
});