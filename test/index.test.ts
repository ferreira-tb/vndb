import { expect, expectTypeOf, test, assertType } from 'vitest';
import { VNDB } from '../src';
import config from '../config.json' assert { type: 'json' };
import type { ResponseAuthinfo, ResponseStats, User, ResponseUser } from '../typings';

const vndb = new VNDB();

test.skip('stats', async () => {
    const stats = await vndb.stats();
    assertType<ResponseStats>(stats);
});

test.skip('schema', async () => {
    const schema = await vndb.schema();
    expectTypeOf(schema).toMatchTypeOf<Record<string, any>>();
});

test.skip('user', async () => {
    const user = await vndb.user([500, 'u135653', 'NoUserWithThisNameExists']);

    assertType<ResponseUser>(user);
    expect(user['u135653']).toHaveProperty('username');
    expect(user['u135653']).not.toHaveProperty('lengthvotes');

    // @ts-expect-error
    assertType<User>(user['u135653']);
    // @ts-expect-error
    assertType<null>(user['NoUserWithThisNameExists']);
});

test.skip('user fields', async () => {
    const user = await vndb.user(
        [500, 'u135653', 'NoUserWithThisNameExists'],
        ['lengthvotes', 'lengthvotes_sum']
    );

    assertType<ResponseUser>(user);
    expect(user['u135653']).toHaveProperty('username');
    expect(user['u135653']).toHaveProperty('lengthvotes');
    expect(user['u135653']).toHaveProperty('lengthvotes_sum');
});

test.skip('authinfo', async () => {
    const authinfo = await vndb.authinfo(config.token);
    assertType<ResponseAuthinfo>(authinfo);
});