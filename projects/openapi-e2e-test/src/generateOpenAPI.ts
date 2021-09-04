import { generate, GeneratorConfig } from '@oats-ts/generator'
import { reader } from '@oats-ts/openapi-reader'
import { prettierStringify, writer } from '@oats-ts/typescript-writer'
import { validator } from '@oats-ts/openapi-validator'
import { parameterTypes } from '@oats-ts/openapi-parameter-types-generator'
import { validators } from '@oats-ts/openapi-validators-generator'
import { types } from '@oats-ts/openapi-types-generator'
import { api } from '@oats-ts/openapi-api-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { nameProviders, pathProviders } from '@oats-ts/openapi'
import { promises as fs } from 'fs'
import { resolve } from 'path'

const dir = 'src/openapi'

const common: GeneratorConfig = {
  name: nameProviders.default,
  path: pathProviders.byNameAndTarget(dir),
}

export async function generateAll() {
  await fs.rm(resolve(dir), { recursive: true, force: true })
  return generate({
    log: true,
    validator: validator(),
    reader: reader({ path: 'kitchenSink-openapi.json' }),
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
      }),
      typeGuards({
        ...common,
        references: true,
        arrays: true,
        records: true,
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
