import { harness } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { openAPIGenerator, schemaTypesGenerator, singleFile } from '@oats-ts/openapi-generator'
import { babelWriter } from '@oats-ts/babel-writer'

describe('workflow test', () => {
  it('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'kitchenSink.json' }))
      .generate(openAPIGenerator({ path: singleFile('generated/generated.ts') })(schemaTypesGenerator()))
      .write(babelWriter({}))
      .run()
  })
})
