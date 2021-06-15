import { harness } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { openAPIGenerator, OpenAPIGeneratorTarget, types, operations, typeGuards } from '@oats-ts/openapi-generator'
import { babelWriter, defaultStringify, prettierStringify } from '@oats-ts/babel-writer'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { identifier, memberExpression, stringLiteral } from '@babel/types'

const prettierConfiguration = JSON.parse(readFileSync(resolve('..', '.prettierrc'), 'utf-8'))

function path(_: any, name: string, target: OpenAPIGeneratorTarget) {
  if (target.startsWith('operation')) {
    return resolve(join('generated', 'operations', `${_.operationId}.ts`))
  }
  return resolve(join('generated', 'types.ts'))
  // return resolve(join('generated', target, `${name}.ts`))
}

describe('workflow test', () => {
  it('should generate', async () => {
    await harness()
      .read(openAPIReader({ path: 'kitchenSink.json' }))
      .generate(openAPIGenerator({ path })(types(), typeGuards({ mode: 'shallow' })))
      .write(babelWriter({ stringify: defaultStringify }))
      .run()
  })
})
