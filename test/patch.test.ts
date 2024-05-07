import { VNDB } from '../src';
import { expect, test } from 'vitest';
import config from '../config.json' assert { type: 'json' };

const vndb = new VNDB();

test('PATCH /ulist/<id>', async () => {
  const response = await vndb.patch.ulist('v2713', {
    token: config.token,
    vote: 100,
    notes: new Date().toLocaleString()
  });

  expect(response.ok).toBe(true);
});
