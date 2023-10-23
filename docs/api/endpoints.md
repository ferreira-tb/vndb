# Endpoints
Endpoints can be accessed from properties whose name is the HTTP method you want to use. For a complete list of all available endpoints, check the [VNDB API documentation](https://api.vndb.org/kana#simple-requests).

```ts{6,20,24}
import { QueryBuilder, VNDB } from 'vndb-query';

const vndb = new VNDB();

// If you want to use GET /stats, you should:
const stats = await vndb.get.stats();

// What about searching some visual novels?
const query = new QueryBuilder({ fields: 'title', results: 5 });
query
    .and(({ f, or }) => {
        or(() => {
            f('lang').eq.v('en');
            f('lang').eq.v('de');
            f('lang').eq.v('fr');
        });
        f('olang').not.v('ja');
    });

const vns = await vndb.post.vn(query);

// Maybe you want to PATCH a visual in a user's list:
const token = 'TOP SECRET';
await vndb.patch.ulist('v2713', {
    token,
    vote: 100,
    notes: 'This is a masterpiece.'
});
```

::: tip
If the endpoint name is **unambiguous**, i.e. only work with a single HTTP method, you don't need to use the method name. In other words, something like  `vndb.get.stats()` could be rewritten as `vndb.stats()`.
:::