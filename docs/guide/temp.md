```ts{6,20,23}
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

// Maybe you want to PATCH a visual in an user's list:
await vndb.patch.ulist('v2713', {
    token: 'TOP SECRET',
    vote: 100,
    notes: 'This is a masterpiece.'
});
```
