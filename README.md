# VNDB Query
VNDB Query is a tool designed to help you interact with the [VNDB database](https://vndb.org/) via its [HTTPS API](https://api.vndb.org/kana).
For this purpose, it has a custom query builder created specifically to build queries for the VNDB API.

You can use VNDB Query to create applications, browser extensions or simply for some quick queries.

```
npm install --save vndb-query
```

## Usage
```ts
import { QueryBuilder, VNDB } from 'vndb-query';

const fields = ['title', 'image.url'];
const query = new QueryBuilder({ fields });

// Same as ['id', '=', 'v30168']
query.f('id').eq.v('v30168');

const { results } = await vndb.post.vn(query);
console.log(results);
```

## Documentation
To check out docs, visit [tb.dev.br/vndb-query](https://tb.dev.br/vndb-query/api/getting-started.html).

## License
[MIT](https://github.com/ferreira-tb/vndb-query/blob/main/LICENSE)
