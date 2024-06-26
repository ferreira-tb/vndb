# Introduction

Custom query builder to interact with the [VNDB database](https://vndb.org/) via its [HTTPS API](https://api.vndb.org/kana).

## Installation

::: code-group

```sh [npm]
npm i @tb-dev/vndb
```

```sh [pnpm]
pnpm add @tb-dev/vndb
```

```sh [yarn]
yarn add @tb-dev/vndb
```

```sh [bun]
bun add @tb-dev/vndb
```

:::

### Prerequisites

This package can be used in any JavaScript environment, such as browsers and [Node.js](https://nodejs.org/), as long as it supports [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#browser_compatibility).

## Usage

This is a simple example of how to use it to search for a visual novel by its ID:

```ts
import { QueryBuilder, VNDB } from '@tb-dev/vndb';

const fields = ['title', 'image.url'];
const query = new QueryBuilder({ fields });

// Same as ['id', '=', 'v30168']
query.f('id').eq.v('v30168');

const vndb = new VNDB();
const { results } = await vndb.post.vn(query);
console.log(results);
```

::: tip TypeScript
Thanks to [TypeScript](https://www.typescriptlang.org/), it provides detailed typing for each enpoint, drastically reducing the need to consult documentation.
:::
