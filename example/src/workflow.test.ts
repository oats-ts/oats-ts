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
    return resolve(join('generated', 'ApiRequests.ts'))
  }
  if (target === 'validator') {
    return resolve(join('generated', 'Validators.ts'))
  }
  return resolve(join('generated', 'types.ts'))
}

describe('workflow test', () => {
  it('should generate using typescript', async () => {
    await harness()
      .read(openAPIReader({ path: 'adyen.json' }))
      .generate(tsOpenAPIGenerator({ path })(types(), validators({ references: true })))
      .write(typeScriptWriter({ stringify: tsPrettierStringify(prettierConfiguration) }))
      .run()
  })
  xit('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'kitchenSink.json' }))
      .generate(
        openAPIGenerator({ path })(
          // types(),
          // typeGuards({ mode: 'shallow' }),
          operations(),
          api({ class: true, stub: true }),
        ),
      )
      .write(babelWriter({ stringify: prettierStringify(prettierConfiguration) }))
      .run()
  })
})
