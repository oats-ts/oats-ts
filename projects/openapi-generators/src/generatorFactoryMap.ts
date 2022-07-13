import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { factories } from './factories'
import { OpenAPIGenerator } from './types'

export const generatorFactoryMap: Record<OpenAPIGeneratorTarget, (config?: any) => OpenAPIGenerator> = {
  'json-schema/type-guard': factories.typeGuards,
  'json-schema/type-validator': factories.typeValidators,
  'json-schema/type': factories.types,
  'openapi/api-type': factories.apiType,
  'openapi/express-cors-middleware': factories.expressCorsMiddleware,
  'openapi/express-route-factory': factories.expressRouteFactory,
  'openapi/express-route': factories.expressRoutes,
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
}
