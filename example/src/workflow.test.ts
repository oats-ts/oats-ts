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
  tsOpenAPIGenerator,
} from '@oats-ts/openapi-generator'
import { babelWriter, prettierStringify, tsPrettierStringify, typeScriptWriter } from '@oats-ts/babel-writer'
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

describe('workflow test', () => {
  it('should generate using typescript', async () => {
    await harness()
      .read(openAPIReader({ path: 'adyen.json' }))
      .generate(
        tsOpenAPIGenerator({ path })(
          types({
            documentation: true,
            enums: true,
          }),
          validators({
            references: true,
          }),
          typeGuards({
            references: true,
            arrays: true,
            records: true,
            unionReferences: true,
          }),
          operations(),
          api({
            type: true,
            class: true,
            stub: true,
            documentation: true,
          }),
        ),
      )
      .write(typeScriptWriter({ stringify: tsPrettierStringify(prettierConfiguration) }))
      .run()
  })
  xit('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'kitchenSink.json' }))
      .generate(
        openAPIGenerator({ path })(),
        // types(),
        // typeGuards({ mode: 'shallow' }),
        // operations(),
      )
      .write(babelWriter({ stringify: prettierStringify(prettierConfiguration) }))
      .run()
  })
})
