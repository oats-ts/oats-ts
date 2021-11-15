import {
  generators as g,
  generate,
  nameProviders,
  pathProviders,
  validator,
  writer,
  reader,
  prettierStringify,
} from '@oats-ts/openapi'
import { GeneratorModel } from './GeneratorModel'

export async function generateCode({ sourcePath, schemaPath }: GeneratorModel) {
  return generate({
    configuration: {
      log: true,
      name: nameProviders.default,
      path: pathProviders.singleFile(sourcePath),
    },
    validator: validator(),
    reader: reader({ path: schemaPath }),
    generators: [
      g.types({ documentation: true }),
      g.typeValidators({ references: true, arrays: true, records: true }),
      g.typeGuards({ references: true, arrays: true, records: true }),
      g.queryParameterTypes({ documentation: true }),
      g.pathParameterTypes({ documentation: true }),
      g.requestHeaderParameterTypes({ documentation: true }),
      g.responseHeaderParameterTypes({ documentation: true }),
      g.requestTypes(),
      g.requestServerTypes(),
      g.responseBodyValidators(),
      g.requestBodyValidators(),
      g.responseTypes(),
      // Serializers
      g.pathParameterSerializers(),
      g.queryParameterSerializers(),
      g.requestHeaderParameterSerializers(),
      g.responseHeaderParameterSerializers(),
      // Deserializers
      g.pathParameterDeserializers(),
      g.queryParameterDeserializers(),
      g.requestHeaderParameterDeserializers(),
      g.responseHeaderParameterDeserializers(),
      g.operations({ validate: true, documentation: true }),
      g.sdkType({ documentation: true }),
      g.sdkImplementation({ documentation: true }),
      g.sdkStub(),
      g.apiType({ documentation: true }),
      g.expressRoute(),
      g.expressRoutesType(),
      g.expressRouteFactory(),
    ],
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
