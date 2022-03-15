# @oats

Comprehensive typescript code generators for OpenAPI (and hopefully AsyncAPI in the future).

## usage

```ts
import { generate, nameProviders, pathProviders, presets, prettierStringify, reader, writer } from '@oats-ts/openapi'
import prettierConfig from './.prettierrc.json'

generate({
  configuration: {
    log: true,
    name: nameProviders.default(),
    path: pathProviders.default('src/generated'),
  },
  reader: reader({
    path: 'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json',
  }),
  generators: presets.fullStack(),
  writer: writer({
    stringify: prettierStringify(prettierConfig),
  }),
})
```

## Docs

[https://github.com/bali182/oats/wiki](https://github.com/bali182/oats/wiki)
