# Endpoints

Endpoints can be accessed from properties whose name is the HTTP method you want to use. For more details on each endpoint, check the [VNDB API documentation](https://api.vndb.org/kana#simple-requests).

::: tip
If the endpoint name is **unambiguous**, i.e. only work with a single HTTP method, you don't need to use the method name. In other words, something like `vndb.get.stats()` could be rewritten as `vndb.stats()`.
:::

## GET /authinfo

Validates and returns information about the given [API Token](https://api.vndb.org/kana#user-authentication).

### Example

```ts
import { VNDB } from 'vndb-query';

const vndb = new VNDB();
const info = await vndb.get.authinfo('MY SECRET');
```

### Type

```ts
function authinfo(token: string): Promise<ResponseGetAuthinfo>;

type ResponseGetAuthinfoPermissions = 'listread' | 'listwrite';

type ResponseGetAuthinfo = {
	id: string;
	username: string;
	permissions: ResponseGetAuthinfoPermissions[];
};
```

## GET /schema

Returns a JSON object with metadata about several API objects, including enumeration values, which fields are available for querying and a list of supported external links.

### Type

```ts
function schema(options?: RequestBasicOptions): Promise<ResponseGetSchema>;

type ResponseGetSchema = Record<string, unknown>;
```

## GET /stats

Returns a few overall database statistics.

### Type

```ts
function stats(options?: RequestBasicOptions): Promise<ResponseGetStats>;

type ResponseGetStats = {
	chars: number;
	producers: number;
	releases: number;
	staff: number;
	tags: number;
	traits: number;
	vn: number;
};
```

## GET /user

Lookup users by id or username.

### Example

```ts
// Fetch only one user.
const user = await vndb.get.user('u2');

// Fetch many users.
const many = await vndb.get.user(['u1', 'u2', 'u3']);
```

### Type

```ts
function user(
	users: MaybeArray<string>,
	fields?: MaybeArray<RequestGetUserFields>,
	options?: RequestBasicOptions
): Promise<ResponseGetUser>;

type ResponseGetUserUser = {
	id: string;
	username: string;
	lengthvotes?: number;
	lengthvotes_sum?: number;
};

type ResponseGetUser = Record<string, ResponseGetUserUser | null>;
```

## GET /ulist_labels

Fetch the list labels for a certain user.

### Example

```ts
vndb.get.ulistLabels('u2').then((labels) => console.log(labels));
```

### Type

```ts
function ulistLabels(
	user?: string,
	fields?: MaybeArray<'count'>,
	options?: RequestBasicOptions
): Promise<ResponseGetUserListLabels>;

type ResponseGetUserListLabelsLabel = {
	id: number;
	private: boolean;
	label: string;
	count: number;
};

type ResponseGetUserListLabels = {
	labels: ResponseGetUserListLabelsLabel[];
};
```

## POST /character

### Example

```ts
const query = new QueryBuilder({
	results: 10,
	fields: ['name', 'original', 'age']
});

query.filter('search').equal.value('Ame');
const vn = await vndb.post.vn(query);
```

### Type

```ts
function character(
	query: QueryBuilder<'character'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'character'>>;
```

## POST /producer

### Type

```ts
function producer(
	query: QueryBuilder<'producer'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'producer'>>;
```

## POST /release

### Type

```ts
function release(
	query: QueryBuilder<'release'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'release'>>;
```

## POST /tag

### Type

```ts
function tag(
	query: QueryBuilder<'tag'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'tag'>>;
```

## POST /trait

### Type

```ts
function trait(
	query: QueryBuilder<'trait'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'trait'>>;
```

## POST /vn

Query visual novel entries.

### Example

```ts
const query = new QueryBuilder();
query.filter('id').equal.value('v1194');
const vn = await vndb.post.vn(query);
```

### Type

```ts
function vn(
	query: QueryBuilder<'vn'>,
	options?: RequestBasicOptions
): Promise<QueryBuilderResponse<'vn'>>;
```

## PATCH /ulist/\<id\>

Add or update a visual novel in the user’s list. Requires the [`listwrite`](https://api.vndb.org/kana#get-authinfo) permission.

### Example

```ts
const vndb = new VNDB();
vndb.patch.ulist('v6540', {
	token: 'MY TOKEN',
	vote: 100,
	notes: 'Nemu best girl'
});
```

### Type

```ts
function ulist(id: string, options: RequestPatchUserList): Promise<Response>;
```

## PATCH /rlist/\<id\>

Add or update a release in the user’s list. Requires the [`listwrite`](https://api.vndb.org/kana#get-authinfo) permission. All visual novels linked to the release are also added to the user’s visual novel list, if they aren’t in the list yet.

### Type

```ts
function rlist(
	id: string,
	options: RequestPatchUserListReleaseList
): Promise<Response>;
```

## DELETE /ulist/\<id\>

Remove a visual novel from the user’s list. Removing a VN also removes any associated releases from the user’s list.

### Example

```ts
const vndb = new VNDB();
vndb.delete.ulist('v6710', {
	token: 'MY TOKEN'
});
```

### Type

```ts
function ulist(id: string, options: RequestDeleteUserList): Promise<Response>;
```

## DELETE /rlist/\<id\>

Remove a release from the user’s list. Removing a release does not remove the associated visual novels from the user’s visual novel list, that requires separate calls to [DELETE /ulist](./endpoints.md#delete-ulistid).

### Type

```ts
function rlist(
	id: string,
	options: RequestDeleteUserListReleaseList
): Promise<Response>;
```
