import { generate, GeneratorConfig } from '@oats-ts/generator'
import { reader } from '@oats-ts/asyncapi-reader'
import { prettierStringify, writer } from '@oats-ts/typescript-writer'
import { types } from '@oats-ts/asyncapi-types-generator'
import { channels } from '@oats-ts/asyncapi-ws-channels-generator'
import { api } from '@oats-ts/asyncapi-ws-api-generator'
import { nameProvider, byNameAndTarget } from '@oats-ts/asyncapi'

const common: GeneratorConfig = {
  name: nameProvider,
  path: byNameAndTarget('src/asyncapi'),
}

export async function generateAll() {
  return generate({
    log: true,
    validator: null,
    reader: reader({ path: 'kitchenSink-asyncapi.json' }), // https://api.apis.guru/v2/specs/amadeus.com/2.2.0/openapi.json
    generators: [
      types({
        ...common,
        documentation: true,
        enums: true,
      }),
      channels({
        ...common,
      }),
      api({
        ...common,
        class: true,
        stub: true,
        type: true,
        documentation: true,
      }),
    ],
    writer: writer({
      purge: true,
      stringify: prettierStringify({
        parser: 'typescript',
        arrowParens: 'always',
        printWidth: 120,
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      }),
    }),
  })
}
