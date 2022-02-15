import {
  generate,
  nameProviders,
  pathProviders,
  validator,
  writer,
  reader,
  prettierStringify,
  presets,
} from '@oats-ts/openapi'
import { GeneratorModel } from './GeneratorModel'

export async function generateCode({ sourcePath, schemaPath }: GeneratorModel) {
  return generate({
    configuration: {
      log: true,
      name: nameProviders.default(),
      path: pathProviders.singleFile(sourcePath),
    },
    validator: validator(),
    reader: reader({ path: schemaPath }),
    generators: presets.fullStack({
      'json-schema/type-guard': {
        ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
      },
      'json-schema/type-validator': {
        arrays: true,
        records: true,
        references: true,
      },
    }),
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
