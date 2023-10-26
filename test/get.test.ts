import { expect, test } from 'vitest';
import { z } from 'zod';
import { VNDB } from '../src';
import config from '../config.json' assert { type: 'json' };

const vndb = new VNDB();

test('GET /schema', async () => {
	const schema = await vndb.schema();
	const parser = z.object({
		api_fields: z.unknown(),
		enums: z.unknown(),
		extlinks: z.unknown()
	});

	parser.parse(schema);
});

test('GET /stats', async () => {
	const parser = z.object({
		chars: z.number(),
		producers: z.number(),
		releases: z.number(),
		staff: z.number(),
		tags: z.number(),
		traits: z.number(),
		vn: z.number()
	});

	const stats = await vndb.stats();
	parser.parse(stats);
});

test('GET /user', async () => {
	const user = await vndb.user(
		['u500', 'u135653', 'NoUserWithThisNameExists'],
		['lengthvotes', 'lengthvotes_sum']
	);

	const parser = z.object({
		id: z.string(),
		lengthvotes: z.number().optional(),
		lengthvotes_sum: z.number().optional(),
		username: z.string()
	});

	z.record(z.union([parser, z.null()])).parse(user);

	parser.parse(user['u135653']);
	expect(() => parser.parse(user['NoUserWithThisNameExists'])).toThrowError();
	z.null().parse(user['NoUserWithThisNameExists']);

	expect(user['u135653']).toHaveProperty('username');
	expect(user['u135653']).toHaveProperty('lengthvotes');
	expect(user['u135653']).toHaveProperty('lengthvotes_sum');
});

test('GET /authinfo', async () => {
	const authinfo = await vndb.authinfo(config.token);
	const parser = z.object({
		id: z.string(),
		permissions: z.array(
			z.union([z.literal('listread'), z.literal('listwrite')])
		),
		username: z.string()
	});

	parser.parse(authinfo);
});

test('GET /ulist_labels', async () => {
	const { labels } = await vndb.get.ulistLabels('u2', 'count');
	const parser = z.object({
		count: z.number(),
		id: z.number(),
		label: z.string(),
		private: z.boolean()
	});

	z.array(parser).parse(labels);
});
