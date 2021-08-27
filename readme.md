# @oats

Comprehensive typescript code generators for OpenAPI and AsyncAPI.

## usage

```ts
import { generate } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { typescriptWriter, prettierStringify } from '@oats-ts/typescript-writer'
import { types } from '@oats-ts/openapi-types-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { parameterTypes } from '@oats-ts/openapi-parameter-types-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
import { singleFile, nameProvider, OpenAPIGeneratorConfig } from '@oats-ts/openapi'

const common: OpenAPIGeneratorConfig = {
  // Default name provider with sensible defaults.
  name: nameProvider,
  // Provides the single file name for each file, meaning all artifacts will be put in api.ts
  path: singleFile('src/generated/api.ts'),
}

export async function generateAll() {
  return generate({
    // Logs to the console while performing the steps
    log: true,
    // Reads using the OpenAPI reader from the kitchenSink.json file
    reader: openAPIReader({ path: 'kitchenSink.json' }),
    // List of generators to be used
    generators: [
      // Types generates typescript types from the named schemas in your OpenAPI file
      types({
        ...common,
        documentation: true,
        enums: false,
      }),
      // Parameter types generates aggregate types for your parameters for each operation.
      parameterTypes({
        ...common,
        documentation: true,
      }),
      // Operations generates a function that hits and endpoint. Relies on the above 2 generators.
      operations({
        ...common,
        validate: false,
        documentation: true,
      }),
    ],
    // Writer writes the output of above generators to the disk. Stringifies the source using prettier.
    writer: typeScriptWriter({
      purge: true,
      stringify: prettierStringify({ parser: 'typescript' }),
    }),
  })
}
```

## Docs

[https://github.com/bali182/oats/wiki](https://github.com/bali182/oats/wiki)
