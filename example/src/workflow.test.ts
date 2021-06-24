import { harness } from '@oats-ts/generator'
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

const prettierConfiguration = JSON.parse(readFileSync(resolve('..', '.prettierrc'), 'utf-8'))

function path(_: any, name: string, target: OpenAPIGeneratorTarget) {
  if (target.startsWith('operation')) {
    return resolve(join('generated', 'operations', `${_.operationId}.ts`))
  }
  if (target.startsWith('api')) {
    return resolve(join('generated', 'apiRequests.ts'))
  }
  if (target === 'validator') {
    return resolve(join('generated', 'validators.ts'))
  }
  if (target === 'type-guard') {
    return resolve(join('generated', 'typeGuards.ts'))
  }
  return resolve(join('generated', 'types.ts'))
}

function name(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  if (target === 'operation-response-type') {
    return `${defaultNameProvider(input, name, target)}Type`
  }
  return defaultNameProvider(input, name, target)
}

describe('workflow test', () => {
  it('should generate using typescript', async () => {
    await harness()
      .read(openAPIReader({ path: 'adyen.json' }))
      .generate(
        openAPIGenerator({ path, name })(
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
      )
      .write(typeScriptWriter({ stringify: prettierStringify(prettierConfiguration) }))
      .run()
  })
})
