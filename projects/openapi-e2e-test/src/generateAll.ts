import { generate } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { parameterTypes } from '@oats-ts/openapi-parameter-types-generator'
import { validators } from '@oats-ts/openapi-validators-generator'
import { types } from '@oats-ts/openapi-types-generator'
import { api } from '@oats-ts/openapi-api-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { prettierStringify, typeScriptWriter } from '@oats-ts/typescript-writer'
import { singleFile, nameProvider, OpenAPIGeneratorConfig, byTarget } from '@oats-ts/openapi'
import { validator } from '@oats-ts/openapi-validator'

const common: OpenAPIGeneratorConfig = {
  name: nameProvider,
  path: singleFile('src/generated/api.ts'), // byTarget('src/generated/byTarget'),
}

export async function generateAll() {
  return generate({
    log: true,
    validator: validator(),
    reader: openAPIReader({ path: 'kitchenSink.json' }), // https://api.apis.guru/v2/specs/amadeus.com/2.2.0/openapi.json
    generators: [
      types({
        ...common,
        documentation: true,
        enums: true,
      }),
      validators({
        ...common,
        references: true,
        arrays: true,
        records: true,
        unionReferences: true,
      }),
      typeGuards({
        ...common,
        references: true,
        arrays: true,
        records: true,
        unionReferences: true,
      }),
      parameterTypes({
        ...common,
        documentation: true,
      }),
      operations({
        ...common,
        validate: true,
        documentation: true,
      }),
      api({
        ...common,
        type: true,
        class: true,
        stub: true,
        documentation: true,
      }),
    ],
    writer: typeScriptWriter({
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