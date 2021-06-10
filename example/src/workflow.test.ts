import { harness } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { openAPIGenerator, schemaTypesGenerator, operationsGenerator } from '@oats-ts/openapi-generator'
import { babelWriter } from '@oats-ts/babel-writer'
import { join, resolve } from 'path'

function path(_: any, name: string, target: string) {
  return resolve(join('generated', target, `${name}.ts`))
}

describe('workflow test', () => {
  it('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'kitchenSink.json' }))
      .generate(openAPIGenerator({ path })(schemaTypesGenerator(), operationsGenerator()))
      .write(babelWriter())
      .run()
  })
})
