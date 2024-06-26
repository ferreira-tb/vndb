# @tb-dev/vndb

Custom query builder to interact with the [VNDB database](https://vndb.org/) via its [HTTPS API](https://api.vndb.org/kana).

```
npm i @tb-dev/vndb
```

## Usage

```ts
import { QueryBuilder, VNDB } from '@tb-dev/vndb';

const fields = ['title', 'image.url'];
const query = new QueryBuilder({ fields });

// Same as ['id', '=', 'v30168']
query.f('id').eq.v('v30168');

const { results } = await vndb.post.vn(query);
console.log(results);
```

## Documentation

Read the [documentation](https://tb.dev.br/vndb/guide/introduction.html) for more details.

## License

[MIT](https://github.com/ferreira-tb/vndb/blob/main/LICENSE)
