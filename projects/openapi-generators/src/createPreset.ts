import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIGenerator } from './types'
import { factories } from './factories'
import { entries, isNil } from 'lodash'

const factoryMap: Record<OpenAPIGeneratorTarget, (config?: any) => OpenAPIGenerator> = {
  'openapi/api-type': factories.apiType,
  'openapi/express-cors-middleware': factories.expressCorsMiddleware,
  'openapi/express-route': factories.expressRoutes,
  'openapi/express-route-factory': factories.expressRouteFactory,
  'openapi/express-routes-type': factories.expressRoutesType,
  'openapi/operation': factories.operations,
  'openapi/path-deserializer': factories.pathDeserializers,
  'openapi/path-serializer': factories.pathSerializers,
  'openapi/path-type': factories.pathTypes,
  'openapi/query-deserializer': factories.queryDeserializers,
  'openapi/query-serializer': factories.querySerializers,
  'openapi/query-type': factories.queryTypes,
  'openapi/request-body-validator': factories.requestBodyValidators,
  'openapi/request-headers-deserializer': factories.requestHeadersDeserializers,
  'openapi/request-headers-serializer': factories.requestHeadersSerializers,
  'openapi/request-headers-type': factories.requestHeadersTypes,
  'openapi/request-server-type': factories.requestServerTypes,
  'openapi/request-type': factories.requestTypes,
  'openapi/response-body-validator': factories.responseBodyValidators,
  'openapi/response-headers-deserializer': factories.responseHeadersDeserializers,
  'openapi/response-headers-serializer': factories.responseHeadersSerializers,
  'openapi/response-headers-type': factories.responseHeadersTypes,
  'openapi/response-type': factories.responseTypes,
  'openapi/sdk-impl': factories.sdkImpl,
  'openapi/sdk-type': factories.sdkType,
  'json-schema/type': undefined,
  'json-schema/type-validator': undefined,
  'json-schema/type-guard': undefined,
}

export const createPreset =
  (defaultConfig: PresetConfiguration) =>
  (overrides: PresetConfiguration = {}): OpenAPIGenerator[] => {
    const generators: OpenAPIGenerator[] = []
    for (const [target, generatorConfig] of entries({ ...defaultConfig, ...overrides })) {
      if (generatorConfig !== false && !isNil(generatorConfig)) {
        const factory = factoryMap[target as OpenAPIGeneratorTarget]
        if (isNil(factory)) {
          throw new TypeError(`Unknown target "${target}"`)
        }
        generators.push(generatorConfig === true ? factory() : factory(generatorConfig))
      }
    }
    return generators
  }