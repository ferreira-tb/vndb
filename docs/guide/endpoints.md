# Endpoints

Endpoints can be accessed from properties whose name is the HTTP method you want to use. For more details on each endpoint, check the [VNDB API documentation](https://api.vndb.org/kana#simple-requests).

::: tip
Some endpoints have a shorthand. For example, [`vndb.get.stats()`](https://tb.dev.br/vndb/api/classes/VNDB.html#get) could be written as [`vndb.stats()`](https://tb.dev.br/vndb/api/classes/VNDB.html#stats-1).
:::

## GET /authinfo

Validates and returns information about the given [API Token](https://api.vndb.org/kana#user-authentication).

### Example

```ts
import { VNDB } from '@tb-dev/vndb';

const vndb = new VNDB();
const info = await vndb.get.authinfo('MY SECRET');
```

## GET /schema

Returns a JSON object with metadata about several API objects, including enumeration values, which fields are available for querying and a list of supported external links.

- Response: [ResponseGetSchema](https://tb.dev.br/vndb/api/interfaces/ResponseGetSchema.html)
- Read more: [GET /schema](https://api.vndb.org/kana#get-schema)

## GET /stats

Returns a few overall database statistics.

- Response: [ResponseGetStats](https://tb.dev.br/vndb/api/interfaces/ResponseGetStats.html)
- Read more: [GET /stats](https://api.vndb.org/kana#get-stats)

## GET /user

Lookup users by id or username.

- Response: [ResponseGetUser](https://tb.dev.br/vndb/api/types/ResponseGetUser.html)
- Read more: [GET /user](https://api.vndb.org/kana#get-user)

### Example

```ts
// Fetch only one user.
const user = await vndb.get.user('u2');

// Fetch many users.
const many = await vndb.get.user(['u1', 'u2', 'u3']);
```

## GET /ulist_labels

Fetch the list labels for a certain user.

- Response: [ResponseGetUserListLabels](https://tb.dev.br/vndb/api/interfaces/ResponseGetUserListLabels.html)
- Read more: [GET /ulist_labels](https://api.vndb.org/kana#get-ulist_labels)

### Example

```ts
vndb.get.ulistLabels('u2').then((labels) => console.log(labels));
```

::: warning
The name of the method is not written in [snake_case](https://en.wikipedia.org/wiki/Snake_case), as in the endpoint, but in [camelCase](https://en.wikipedia.org/wiki/Camel_case).
:::

## POST /character

- Response: [ResponsePostCharacter](https://tb.dev.br/vndb/api/interfaces/ResponsePostCharacter.html)
- Read more: [POST /character](https://api.vndb.org/kana#post-character)

### Example

```ts
const query = new QueryBuilder({
  fields: ['name', 'original', 'age'],
  sort: 'name',
  results: 10
});

query.filter('search').equal.value('Ame');
const vn = await vndb.post.character(query);
```

## POST /producer

- Response: [ResponsePostProducer](https://tb.dev.br/vndb/api/interfaces/ResponsePostProducer.html)
- Read more: [POST /producer](https://api.vndb.org/kana#post-producer)

## POST /release

- Response: [ResponsePostRelease](https://tb.dev.br/vndb/api/interfaces/ResponsePostRelease.html)
- Read more: [POST /release](https://api.vndb.org/kana#post-release)

## POST /tag

- Response: [ResponsePostTag](https://tb.dev.br/vndb/api/interfaces/ResponsePostTag.html)
- Read more: [POST /tag](https://api.vndb.org/kana#post-tag)

## POST /trait

- Response: [ResponsePostTrait](https://tb.dev.br/vndb/api/interfaces/ResponsePostTrait.html)
- Read more: [POST /trait](https://api.vndb.org/kana#post-trait)

## POST /vn

Query visual novel entries.

- Response: [ResponsePostVisualNovel](https://tb.dev.br/vndb/api/interfaces/ResponsePostVisualNovel.html)
- Read more: [POST /vn](https://api.vndb.org/kana#post-vn)

### Example

```ts
const query = new QueryBuilder();
query.filter('id').equal.value('v1194');
const vn = await vndb.post.vn(query);
```

## PATCH /ulist/\<id\>

Add or update a visual novel in the user’s list. Requires the [`listwrite`](https://api.vndb.org/kana#get-authinfo) permission.

- Read more: [PATCH /ulist/\<id\>](https://api.vndb.org/kana#patch-ulistid)

### Example

```ts
const vndb = new VNDB();
vndb.patch.ulist('v6540', {
  token: 'MY TOKEN',
  vote: 100,
  notes: 'Nemu best girl'
});
```

## PATCH /rlist/\<id\>

Add or update a release in the user’s list. Requires the [`listwrite`](https://api.vndb.org/kana#get-authinfo) permission. All visual novels linked to the release are also added to the user’s visual novel list, if they aren’t in the list yet.

- Read more: [PATCH /rlist/\<id\>](https://api.vndb.org/kana#patch-rlistid)

## DELETE /ulist/\<id\>

Remove a visual novel from the user’s list. Removing a VN also removes any associated releases from the user’s list.

- Read more: [DELETE /ulist/\<id\>](https://api.vndb.org/kana#delete-ulistid)

### Example

```ts
const vndb = new VNDB();
vndb.delete.ulist('v6710', {
  token: 'MY TOKEN'
});
```

## DELETE /rlist/\<id\>

Remove a release from the user’s list. Removing a release does not remove the associated visual novels from the user’s visual novel list, that requires separate calls to [DELETE /ulist](./endpoints.md#delete-ulistid).

- Read more: [DELETE /rlist/\<id\>](https://api.vndb.org/kana#delete-rlistid)
