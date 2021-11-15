import {
  generators,
  generate,
  nameProviders,
  pathProviders,
  validator,
  writer,
  reader,
  prettierStringify,
  GeneratorConfig,
} from '@oats-ts/openapi'
import { GeneratorModel } from './GeneratorModel'

export async function generateCode({ sourcePath, schemaPath }: GeneratorModel) {
  const common: GeneratorConfig = {
    name: nameProviders.default,
    path: pathProviders.singleFile(sourcePath),
  }
  return generate({
    log: true,
    validator: validator(),
    reader: reader({ path: schemaPath }),
    generators: [
      generators.types({
        ...common,
        documentation: true,
      }),
      generators.typeValidators({
        ...common,
        references: true,
        arrays: true,
        records: true,
      }),
      generators.typeGuards({
        ...common,
        references: true,
        arrays: true,
        records: true,
      }),
      generators.queryParameterTypes({
        ...common,
        documentation: true,
      }),
      generators.pathParameterTypes({
        ...common,
        documentation: true,
      }),
      generators.requestHeaderParameterTypes({
        ...common,
        documentation: true,
      }),
      generators.responseHeaderParameterTypes({
        ...common,
        documentation: true,
      }),
      generators.requestTypes(common),
      generators.requestServerTypes(common),
      generators.responseBodyValidators(common),
      generators.requestBodyValidators(common),
      generators.responseTypes(common),
      // Serializers
      generators.pathParameterSerializers(common),
      generators.queryParameterSerializers(common),
      generators.requestHeaderParameterSerializers(common),
      generators.responseHeaderParameterSerializers(common),
      // Deserializers
      generators.pathParameterDeserializers(common),
      generators.queryParameterDeserializers(common),
      generators.requestHeaderParameterDeserializers(common),
      generators.responseHeaderParameterDeserializers(common),
      generators.operations({
        ...common,
        validate: true,
        documentation: true,
      }),
      generators.sdkType({
        ...common,
        documentation: true,
      }),
      generators.sdkImplementation({
        ...common,
        documentation: true,
      }),
      generators.sdkStub(common),
      generators.apiType({
        ...common,
        documentation: true,
      }),
      generators.expressRoute(common),
      generators.expressRoutesType(common),
      generators.expressRouteFactory(common),
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
