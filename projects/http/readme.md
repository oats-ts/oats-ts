# oats-ts/http

This is a runtime module responsible for making http requests.

You can require the `execute` method and typings directly from this module:

```ts
// Common way of making HTTP requests
import { execute } from '@oats-ts/http'

// Common HTTP related typings 
import {
  HttpHeaders,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  RequestConfig,
  ResponseExpectations,
  ResponseExpectation,
  StatusCode
} from '@oats-ts/http'
```

This package also exposes default implementations for:
- `fetch` - [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- `node-fetch` - [docs](https://github.com/node-fetch/node-fetch)

They are separated, so when used at runtime, browser dependencies don't bleed into node projects or tests, and vica versa.

You can import `fetch` based methods when writing code for the browser like:

```ts
import {
  request, 
  body,
  headers,
  mimeType,
  serialize,
  statusCode,
  noop,
} from '@oats-ts/http/lib/fetch'
```

And when using node or writing tests, you can import `node-fetch` based methods like:

```ts
import {
  request, 
  body,
  headers,
  mimeType,
  serialize,
  statusCode,
  noop,
} from '@oats-ts/http/lib/node-fetch'
```

Some methods are shared between the two, but for ease of use they are exported separately for both.
