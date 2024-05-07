import { VNDB } from '../src';
import { expect, test } from 'vitest';
import config from '../config.json' assert { type: 'json' };

const vndb = new VNDB();

test('DELETE /ulist/<id>', async () => {
  const response = await vndb.delete.ulist('v1', {
    token: config.token
  });

  expect(response.ok).toBe(true);
});

test('DELETE /rlist/<id>', async () => {
  const response = await vndb.delete.rlist('r83944', {
    token: config.token
  });

  expect(response.ok).toBe(true);
});
