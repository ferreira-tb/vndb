# Query Builder
The query builder is the tool used to refine the database searches. It provides a series of functions that, used in sequence, build the array that will be sent in the body of the request to the VNDB API.

As long as you pay attention to the order in which each function is used, you don't have to use them exactly as in the examples. This gives you the flexibility to find your own style.

::: tip
You can use the `toArray()` and `toJSON()` methods while testing to see how the query looks.
:::

## Usage
To build: `["id", "=", "v17"]`.

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
import { QueryBuilder } from 'vndb-query';

const query = new QueryBuilder();
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
import { QueryBuilder } from 'vndb-query';

const query = new QueryBuilder();
query
    .and(({ f, or }) => {
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

Look carefully at the query built above and the order in which each function was used. First, we call `and` to start combining with the **AND** predicate. Next, we call `or` to define that any of the blocks defined within it are valid for our purposes (after all, we use `eq` as an operator in all of them).

After closing `or`, we start building a new block, where we call `f` (or `filter`) to define that `olang` cannot be equal to `ja`. Immediately after creating this block, we have the end of the `and` that we called at the beginning, which ends the construction of the query.

What we have now is a query that will fetch a visual novel whose language (`lang`) **can be any of** `en`, `de` or `fr`, but its original language (`olang`) **must be different** from `ja`.

If we use the `toArray()` method of the query object to inspect the resulting filters, it will return:
```js
['and',
    ['or',
        [ 'lang', '=', 'en' ],
        [ 'lang', '=', 'de' ],
        [ 'lang', '=', 'fr' ]
    ],
    [ 'olang', '!=', 'ja' ]
]
```

## Type
```ts
interface QueryBuilder {
    // Starts building a filter block (like ["id", "=", "v17"]).
    f: (name: string) => QueryBuilderOperator;
    filter: (name: string) => QueryBuilderOperator;

    // Declares a value.
    // Should ONLY be used after operators (like "equal" or "greater").
    // For example, in the block ["id", "=", "v17"], the value would be "v17".
    v: (value: any) => QueryBuilder;
    value: (value: any) => QueryBuilder;

    // Used to combine different filters.
    and: (cb: (builder: QueryBuilderOperator) => void) => QueryBuilder;
    or: (cb: (builder: QueryBuilderOperator) => void) => QueryBuilder;
}

// Operators can be used only right after `filter`;
// Like the functions, they also have shorthands, such as `equal` and `eq`.
interface QueryBuilderOperator {
    // Equality operator (=).
    eq: QueryBuilder;
    equal: QueryBuilder;

    // Inequality operator (!=).
    not: QueryBuilder;

    // "Greater than" operator (>).
    gt: QueryBuilder;
    greater: QueryBuilder;

    // "Greater than or equal" operator (>=).
    gte: QueryBuilder;
    greaterOrEqual: QueryBuilder;

    // "Lower than" operator (<).
    lt: QueryBuilder;
    lower: QueryBuilder;

    // "Lower than or equal" operator (<=).
    lte: QueryBuilder;
    lowerOrEqual: QueryBuilder;
}
```