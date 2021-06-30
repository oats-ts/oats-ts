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

const common: OpenAPIGeneratorConfig = {
  name: nameProvider,
  path: byTarget('src/generated/byTarget'), // singleFile('src/generated/api.ts'),
}

export async function generateAll() {
  return generate({
    log: true,
    reader: openAPIReader({ path: 'kitchenSink.json' }),
    generators: [
      types({
        ...common,
        documentation: true,
        enums: true,
      }),
      validators({
        ...common,
        references: false,
        arrays: true,
        records: false,
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
