# Introduction

VNDB Query is a tool designed to help you interact with the VNDB database via its [HTTPS API](https://api.vndb.org/kana). For this purpose, it has a [query builder](./query-builder.md) created specifically to build queries for the VNDB API.

You can use VNDB Query to create applications, browser extensions or simply for some quick queries. It is up to you!

## Installation

::: code-group

```sh [npm]
npm i vndb-query
```

```sh [pnpm]
pnpm add vndb-query
```

```sh [yarn]
yarn add vndb-query
```

```sh [bun]
bun add vndb-query
```

:::

### Prerequisites

VNDB Query can be used in any javascript environment, such as browsers and [Node.js](https://nodejs.org/), as long as it supports [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#browser_compatibility).

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

::: tip TypeScript
Thanks to [TypeScript](https://www.typescriptlang.org/), VNDB Query provides detailed typing for each VNDB enpoint, drastically reducing the need to consult the VNDB documentation. And that's even if you don't use it!
:::
