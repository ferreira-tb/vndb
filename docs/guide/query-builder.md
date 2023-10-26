# Query Builder

The query builder is the tool used to refine the database searches. It provides a series of functions that, used in sequence, build the array that will be sent in the body of the request to the VNDB API.

As long as you pay attention to the order in which each function is used, you don't have to use them exactly as in the examples. This gives you the flexibility to find your own style.

For more details, check out the [Query Builder API](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html).

::: tip
You can use the [`toArray()`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#toArray) and [`toJSON()`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#toJSON) methods while testing to see how the query looks.
:::

## Basic search

If you just want, for example, to search for some visual novels or characters by name, you can use the [`search()`](https://tb.dev.br/vndb-query/api/classes/VNDB.html#search) method present in objects of the [`VNDB`](https://tb.dev.br/vndb-query/api/classes/VNDB.html) class.

```ts
import { VNDB } from 'vndb-query';

const vndb = new VNDB();
const vns = await vndb.search('vn', 'Kagura Reimeiki', {
	fields: ['title', 'alttitle', 'devstatus', 'image.url'],
	results: 20
});
```

If we were to use the [Query Builder](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html), the search above would look like this:

```ts
import { VNDB, QueryBuilder } from 'vndb-query';

const query = new QueryBuilder({
	fields: ['title', 'alttitle', 'devstatus', 'image.url'],
	results: 20
});

query.filter('search').equal.value('Kagura Reimeiki');

const vndb = new VNDB();
const vns = await vndb.post.vn(query);
```

## Building queries

To build `["id", "=", "v17"]`:

```ts
import { QueryBuilder } from 'vndb-query';

const query = new QueryBuilder();
query.filter('id').equal.value('v17');

// To do the same using shorthands:
const otherQuery = new QueryBuilder();
simpleQuery.f('id').eq.v('v17');
```

Let's combine some filters now. We will build a query to look for a visual novel whose `lang` is equal to `en` **AND** whose `olang` is not equal to `ja`.

```ts
// Note the use of object destructuring in the callback parameter.
// We do this so that we can collect the `filter` function for use within `and`.
// Don't have to do the same with `value`, because it is returned by the `equal` operator.
query.and(({ filter }) => {
	filter('lang').equal.value('en'); // ["lang", "=", "en"]
	filter('olang').not.value('ja'); // ["lang", "!=", "ja"]
});
```

Finally, something a bit more complex.

```ts
query.and(({ f, or }) => {
	or(() => {
		// Remember that `f` is just a shorthand for `filter`.
		// Just like `eq` is for `equal` and `v` is for `value`.
		f('lang').eq.v('en'); // ["lang", "=", "en"]
		f('lang').eq.v('de'); // ["lang", "=", "de"]
		f('lang').eq.v('fr'); // ["lang", "=", "fr"]
	});

	f('olang').not.v('ja'); // ["lang", "!=", "ja"]
});
```

Look carefully at the query built above and the order in which each function was used. First, we call [`and`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#and) to start combining with the **AND** predicate. Next, we call [`or`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#or) to define that any of the blocks defined within it are valid for our purposes (after all, we use [`eq`](https://tb.dev.br/vndb-query/api/classes/QueryBuilderOperator.html#eq) as an operator in all of them).

After closing `or`, we start building a new block, where we call [`f`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#f) (or `filter`) to define that `olang` cannot be equal to `ja`. Immediately after creating this block, we have the end of the `and` that we called at the beginning, which ends the construction of the query.

What we have now is a query that will fetch a visual novel whose language (`lang`) **can be any of** `en`, `de` or `fr`, but its original language (`olang`) **must be different** from `ja`.

If we use the [`toArray()`](https://tb.dev.br/vndb-query/api/classes/QueryBuilder.html#toArray) method of the query object to inspect the resulting filters, it will return:

<!-- prettier-ignore-start -->
```js
[
	'and',
        ['or',
            ['lang', '=', 'en'],
            ['lang', '=', 'de'],
            ['lang', '=', 'fr']
        ],
        ['olang', '!=', 'ja']
];
```
<!-- prettier-ignore-end -->

## Raw query

You can also enter the filters manually, if for some reason you don't want to use the Query Builder.

```ts
import { VNDB, QueryBuilder } from 'vndb-query';

const query = new QueryBuilder({
	fields: ['title'],
	filters: ['id', '=', 'v31055'],
	results: 20
});

const vndb = new VNDB();
const vn = await vndb.post.vn(query);
```
