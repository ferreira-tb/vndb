import { assertType, expect, test } from 'vitest';
import { QueryBuilder, VNDB } from '../src';
import type { ResponseGetUserListLabelsLabel } from '../typings';
// import config from '../config.json' assert { type: 'json' };

const vndb = new VNDB();

test('POST /ulist', async () => {
    const query = new QueryBuilder({
        user: 'u2',
        fields: ['id', 'vote', 'vn.title'],
        sort: 'vote',
        reverse: true,
        results: 10
    });

    query.f('label').eq.v(7);

    const { results } = await vndb.post.ulist(query);
    expect(results).toHaveLength(10);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('vote');
    expect(results[0]).toHaveProperty('vn');
});

test('GET /ulist_labels', async () => {
    const { labels } = await vndb.get.ulistLabels('u2', 'count');
    expect(labels[0]).toHaveProperty('count');
    assertType<ResponseGetUserListLabelsLabel>(labels[0]);
});