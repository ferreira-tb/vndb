# Introduction

VNDB Query is a tool designed to help you interact with the VNDB database via its [HTTPS API](https://api.vndb.org/kana). For this purpose, it has a [query builder](./query-builder.md) created specifically to build queries for the VNDB API.

You can use VNDB Query to create applications, browser extensions or simply for some quick queries. It is up to you!

## Installation

```sh
npm i vndb-query
```

### Prerequisites

VNDB Query can be used in any javascript environment, such as browsers and [Node.js](https://nodejs.org/), as long as it supports [private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields#browser_compatibility) and [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#browser_compatibility).

### Using from CDN

Alternatively, you can use VNDB Query directly from a CDN via a script tag:

```html
<script src="https://unpkg.com/vndb-query/dist/index.umd.js"></script>
```

Here we are using [unpkg](https://unpkg.com/), but you can also use any other CDN that serves npm packages. Of course, you can also download this file and serve it yourself.

The above link loads the UMD build of VNDB Query, where all top-level classes are exposed as properties on the global `VNDBQuery` object.

```js
const vndb = new VNDBQuery.VNDB();
const query = new VNDBQuery.QueryBuilder();
```

## Usage

This is a simple example of how to use VNDB Query to search for a visual novel by its ID:

```ts
import { QueryBuilder, VNDB } from 'vndb-query';

const fields = ['title', 'image.url'];
const query = new QueryBuilder({ fields });

// Same as ['id', '=', 'v30168']
query.f('id').eq.v('v30168');

const vndb = new VNDB();
const { results } = await vndb.post.vn(query);
console.log(results);
```

::: tip TYPESCRIPT
Thanks to [TypeScript](https://www.typescriptlang.org/), VNDB Query provides detailed typing for each VNDB enpoint, drastically reducing the need to consult the VNDB documentation. And that's even if you don't use it!
:::
