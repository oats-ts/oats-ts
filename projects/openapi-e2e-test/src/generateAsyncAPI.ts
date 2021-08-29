import { generate, GeneratorConfig } from '@oats-ts/generator'
import { reader } from '@oats-ts/asyncapi-reader'
import { prettierStringify, writer } from '@oats-ts/typescript-writer'
import { types } from '@oats-ts/asyncapi-types-generator'
import { validators } from '@oats-ts/asyncapi-validators-generator'
import { channels } from '@oats-ts/asyncapi-ws-channels-generator'
import { api } from '@oats-ts/asyncapi-ws-api-generator'
import { typeGuards } from '@oats-ts/asyncapi-type-guards-generator'
import { nameProvider, byNameAndTarget } from '@oats-ts/asyncapi'
import { promises as fs } from 'fs'
import { resolve } from 'path'

const dir = 'src/asyncapi'

const common: GeneratorConfig = {
  name: nameProvider,
  path: byNameAndTarget(dir),
}

export async function generateAll() {
  await fs.rm(resolve(dir), { recursive: true, force: true })
  return generate({
    log: true,
    validator: null,
    reader: reader({ path: 'kitchenSink-asyncapi.json' }),
    generators: [
      types({
        ...common,
        documentation: true,
        enums: true,
      }),
      channels({
        ...common,
        documentation: true,
      }),
      typeGuards({
        ...common,
        arrays: true,
        records: true,
        references: true,
      }),
      validators({
        ...common,
        arrays: true,
        records: true,
        references: true,
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
