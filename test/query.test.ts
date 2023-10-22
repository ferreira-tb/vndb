import { expect, test } from 'vitest';
import { VNDB, QueryBuilder } from '../src';

const vndb = new VNDB();

test('stats', async () => {
    const query = new QueryBuilder<'vn'>();
    query.filter('search')
    query.filter('developer')

    console.log(query.toJSON());
});