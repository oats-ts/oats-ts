import { GeneratorModel } from './GeneratorModel'
import { generate } from '@oats-ts/generator'
import { reader } from '@oats-ts/asyncapi-reader'
import { writer, prettierStringify } from '@oats-ts/typescript-writer'
import { nameProvider, singleFile } from '@oats-ts/asyncapi'

export async function generateCode({ sourcePath, schemaPath }: GeneratorModel) {
  return generate({
    configuration: {
      log: true,
      name: nameProvider,
      path: singleFile(sourcePath),
    },
    reader: reader({ path: schemaPath }),
    generators: [],
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
