import { generate, GeneratorConfig } from '@oats-ts/generator'
import { reader } from '@oats-ts/openapi-reader'
import { prettierStringify, writer } from '@oats-ts/typescript-writer'
import { validator } from '@oats-ts/openapi-validator'
import {
  queryParameterTypes,
  pathParameterTypes,
  requestHeaderParameterTypes,
  responseHeaderParameterTypes,
} from '@oats-ts/openapi-parameter-types-generator'
import { typeValidators, responseBodyValidators, requestBodyValidators } from '@oats-ts/openapi-validators-generator'
import { types } from '@oats-ts/openapi-types-generator'
import { apiType } from '@oats-ts/openapi-api-type-generator'
import { sdkStub, sdkType, sdkImplementation } from '@oats-ts/openapi-sdk-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { requestTypes, requestServerTypes } from '@oats-ts/openapi-request-types-generator'
import { responseTypes } from '@oats-ts/openapi-response-types-generator'
import {
  pathParameterSerializers,
  queryParameterSerializers,
  requestHeaderParameterSerializers,
  responseHeaderParameterSerializers,
} from '@oats-ts/openapi-parameter-serializers-generator'
import {
  pathParameterDeserializers,
  queryParameterDeserializers,
  requestHeaderParameterDeserializers,
  responseHeaderParameterDeserializers,
} from '@oats-ts/openapi-parameter-deserializers-generator'
import { expressRoute, expressRoutesType, expressMainRouteFactory } from '@oats-ts/openapi-express-routes-generator'
import { nameProviders, pathProviders } from '@oats-ts/openapi'
import { promises as fs } from 'fs'
import { resolve } from 'path'

const dir = 'src/openapi'

const common: GeneratorConfig = {
  name: nameProviders.default,
  path: pathProviders.byNameAndTarget(dir),
}

export async function generateAll() {
  await fs.rm(resolve(dir), { recursive: true, force: true })
  return generate({
    log: true,
    validator: validator(),
    reader: reader({ path: 'kitchenSink-openapi.json' }),
    generators: [
      types({
        ...common,
        documentation: true,
        enums: true,
      }),
      typeValidators({
        ...common,
        references: true,
        arrays: true,
        records: true,
      }),
      typeGuards({
        ...common,
        references: true,
        arrays: true,
        records: true,
      }),
      queryParameterTypes({
        ...common,
        documentation: true,
      }),
      pathParameterTypes({
        ...common,
        documentation: true,
      }),
      requestHeaderParameterTypes({
        ...common,
        documentation: true,
      }),
      responseHeaderParameterTypes({
        ...common,
        documentation: true,
      }),
      requestTypes(common),
      requestServerTypes(common),
      responseBodyValidators(common),
      requestBodyValidators(common),
      responseTypes(common),
      // Serializers
      pathParameterSerializers(common),
      queryParameterSerializers(common),
      requestHeaderParameterSerializers(common),
      responseHeaderParameterSerializers(common),
      // Deserializers
      pathParameterDeserializers(common),
      queryParameterDeserializers(common),
      requestHeaderParameterDeserializers(common),
      responseHeaderParameterDeserializers(common),
      operations({
        ...common,
        validate: true,
        documentation: true,
      }),
      sdkType({
        ...common,
        documentation: true,
      }),
      sdkImplementation({
        ...common,
        documentation: true,
      }),
      sdkStub(common),
      apiType({
        ...common,
        documentation: true,
      }),
      expressRoute(common),
      expressRoutesType(common),
      expressMainRouteFactory(common),
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
