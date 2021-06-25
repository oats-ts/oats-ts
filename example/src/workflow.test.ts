import { generate } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import {
  openAPIGenerator,
  OpenAPIGeneratorTarget,
  types,
  operations,
  typeGuards,
  api,
  validators,
  parameterTypes,
  defaultNameProvider,
} from '@oats-ts/openapi-generator'
import { prettierStringify, typeScriptWriter } from '@oats-ts/typescript-writer'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { SimpleNameProvider } from '../../openapi-generator/lib/typings'

const prettierConfiguration = JSON.parse(readFileSync(resolve('..', '.prettierrc'), 'utf-8'))

function path(input: any, name: SimpleNameProvider, target: OpenAPIGeneratorTarget) {
  switch (target) {
    case 'operation':
    case 'operation-headers-serializer':
    case 'operation-headers-type':
    case 'operation-input-type':
    case 'operation-path-serializer':
    case 'operation-path-type':
    case 'operation-query-serializer':
    case 'operation-query-type':
    case 'operation-response-parser-hint':
    case 'operation-response-type':
      return resolve(join('generated', 'operations', `${name(input, 'operation')}.ts`))
    case 'api-class':
    case 'api-type':
    case 'api-stub':
      return resolve(join('generated', 'apiRequests.ts'))
    case 'validator':
      return resolve(join('generated', 'validators.ts'))
    case 'type-guard':
      return resolve(join('generated', 'typeGuards.ts'))
    case 'type':
      return resolve(join('generated', 'types.ts'))
    default:
      throw new TypeError(`Unexpected target "${target}".`)
  }
}

function name(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  if (target === 'operation-response-type') {
    return `${defaultNameProvider(input, name, target)}Type`
  }
  return defaultNameProvider(input, name, target)
}

describe('workflow test', () => {
  it('should generate using typescript', async () => {
    await generate({
      reader: openAPIReader({ path: 'adyen.json' }),
      generator: openAPIGenerator({ path, name })(
        types({
          documentation: true,
          enums: true,
        }),
        validators({
          references: false,
          arrays: false,
          records: false,
          unionReferences: true,
        }),
        typeGuards({
          references: true,
          arrays: true,
          records: true,
          unionReferences: true,
        }),
        parameterTypes({
          documentation: true,
        }),
        operations({
          documentation: true,
        }),
        api({
          type: true,
          class: true,
          stub: true,
          documentation: true,
        }),
      ),
      writer: typeScriptWriter({ stringify: prettierStringify(prettierConfiguration) }),
    })
  })
})
