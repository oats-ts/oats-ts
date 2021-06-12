import { harness } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import {
  openAPIGenerator,
  schemaTypesGenerator,
  operationsGenerator,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-generator'
import { babelWriter } from '@oats-ts/babel-writer'
import { join, resolve } from 'path'

function path(_: any, name: string, target: OpenAPIGeneratorTarget) {
  if (target.startsWith('operation')) {
    return resolve(join('generated', 'operations', `${_.operationId}.ts`))
  }
  return resolve(join('generated', target, `${name}.ts`))
}

describe('workflow test', () => {
  it('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'operations.json' }))
      .generate(openAPIGenerator({ path })(/*schemaTypesGenerator(),*/ operationsGenerator()))
      .write(babelWriter())
      .run()
  })
})
