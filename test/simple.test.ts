import { expect, expectTypeOf, test, assertType } from 'vitest';
import { VNDB } from '../src';
import config from '../config.json' assert { type: 'json' };
import type { ResponseGetAuthinfo, ResponseGetStats, ResponseGetUserUser, ResponseGetUser } from '../typings';

const vndb = new VNDB();

test('GET /schema', async () => {
    const schema = await vndb.schema();
    expectTypeOf(schema).toMatchTypeOf<Record<string, any>>();
});

test('GET /stats', async () => {
    const stats = await vndb.stats();
    assertType<ResponseGetStats>(stats);
});

test('GET /user', async () => {
    const user = await vndb.user(
        ['u500', 'u135653', 'NoUserWithThisNameExists'],
        ['lengthvotes', 'lengthvotes_sum']
    );

    // @ts-expect-error
    assertType<ResponseGetUserUser>(user['u135653']);
    // @ts-expect-error
    assertType<null>(user['NoUserWithThisNameExists']);

    assertType<ResponseGetUser>(user);
    expect(user['u135653']).toHaveProperty('username');
    expect(user['u135653']).toHaveProperty('lengthvotes');
    expect(user['u135653']).toHaveProperty('lengthvotes_sum');
});

test('GET /authinfo', async () => {
    const authinfo = await vndb.authinfo(config.token);
    assertType<ResponseGetAuthinfo>(authinfo);
});