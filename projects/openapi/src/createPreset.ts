import { typeGuards } from '@oats-ts/json-schema-type-guards-generator'
import { types } from '@oats-ts/json-schema-types-generator'
import { typeValidators } from '@oats-ts/json-schema-validators-generator'
import { apiType } from '@oats-ts/openapi-api-type-generator'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import {
  expressCorsMiddleware,
  expressRoute,
  expressRouteFactory,
  expressRoutesType,
} from '@oats-ts/openapi-express-routes-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import {
  pathParameterDeserializers,
  queryParameterDeserializers,
  requestHeaderParameterDeserializers,
  responseHeaderParameterDeserializers,
} from '@oats-ts/openapi-parameter-deserializers-generator'
import {
  pathParameterSerializers,
  queryParameterSerializers,
  requestHeaderParameterSerializers,
  responseHeaderParameterSerializers,
} from '@oats-ts/openapi-parameter-serializers-generator'
import {
  pathParameterTypes,
  queryParameterTypes,
  requestHeaderParameterTypes,
  responseHeaderParameterTypes,
} from '@oats-ts/openapi-parameter-types-generator'
import { requestServerTypes, requestTypes } from '@oats-ts/openapi-request-types-generator'
import { responseTypes } from '@oats-ts/openapi-response-types-generator'
import { sdkImplementation, sdkType } from '@oats-ts/openapi-sdk-generator'
import { requestBodyValidators, responseBodyValidators } from '@oats-ts/openapi-validators-generator'
import { entries, isNil } from 'lodash'
import { PresetConfiguration } from './typings'

const factories: Record<OpenAPIGeneratorTarget, (config?: any) => OpenAPIGenerator> = {
  'openapi/api-type': apiType,
  'openapi/express-cors-middleware': expressCorsMiddleware,
  'openapi/express-route': expressRoute,
  'openapi/express-route-factory': expressRouteFactory,
  'openapi/express-routes-type': expressRoutesType,
  'openapi/operation': operations,
  'openapi/path-deserializer': pathParameterDeserializers,
  'openapi/path-serializer': pathParameterSerializers,
  'openapi/path-type': pathParameterTypes,
  'openapi/query-deserializer': queryParameterDeserializers,
  'openapi/query-serializer': queryParameterSerializers,
  'openapi/query-type': queryParameterTypes,
  'openapi/request-body-validator': requestBodyValidators,
  'openapi/request-headers-deserializer': requestHeaderParameterDeserializers,
  'openapi/request-headers-serializer': requestHeaderParameterSerializers,
  'openapi/request-headers-type': requestHeaderParameterTypes,
  'openapi/request-server-type': requestServerTypes,
  'openapi/request-type': requestTypes,
  'openapi/response-body-validator': responseBodyValidators,
  'openapi/response-headers-deserializer': responseHeaderParameterDeserializers,
  'openapi/response-headers-serializer': responseHeaderParameterSerializers,
  'openapi/response-headers-type': responseHeaderParameterTypes,
  'openapi/response-type': responseTypes,
  'openapi/sdk-impl': sdkImplementation,
  'openapi/sdk-type': sdkType,
  'json-schema/type': types,
  'json-schema/type-validator': typeValidators,
  'json-schema/type-guard': typeGuards,
}

export const createPreset =
  (defaultConfig: PresetConfiguration) =>
  (overrides: PresetConfiguration = {}): OpenAPIGenerator[] => {
    const generators: OpenAPIGenerator[] = []
    for (const [target, generatorConfig] of entries({ ...defaultConfig, ...overrides })) {
      if (generatorConfig !== false && !isNil(generatorConfig)) {
        const factory = factories[target as OpenAPIGeneratorTarget]
        if (isNil(factory)) {
          throw new TypeError(`Unknown target "${target}"`)
        }
        generators.push(generatorConfig === true ? factory() : factory(generatorConfig))
      }
    }
    return generators
  }
