import { apiType } from './api-type'
import { expressCorsMiddleware } from './express-cors-middleware'
import { expressRoutes } from './express-route'
import { expressRouteFactory } from './express-route-factory'
import { expressRoutesType } from './express-routes-type'
import { group } from './group'
import { operations } from './operations'
import { pathDeserializers } from './path-deserializer'
import { pathSerializers } from './path-serializer'
import { pathTypes } from './path-type'
import { queryDeserializers } from './query-deserializer'
import { querySerializers } from './query-serializer'
import { queryTypes } from './query-type'
import { requestBodyValidators } from './request-body-validator'
import { requestHeadersDeserializers } from './request-headers-deserializer'
import { requestHeadersSerializers } from './request-headers-serializer'
import { requestHeadersTypes } from './request-headers-type'
import { requestServerTypes } from './request-server-type'
import { requestTypes } from './request-type'
import { responseBodyValidators } from './response-body-validator'
import { responseHeadersDeserializers } from './response-headers-deserializer'
import { responseHeadersSerializers } from './response-headers-serializer'
import { responseHeadersTypes } from './response-headers-type'
import { responseTypes } from './response-type'
import { sdkImpl } from './sdk-impl'
import { sdkType } from './sdk-type'
import { typeGuards, types, typeValidators } from '@oats-ts/json-schema-generators'

export const factories = {
  typeGuards,
  types,
  typeValidators,
  apiType,
  expressCorsMiddleware,
  expressRoutes,
  expressRouteFactory,
  expressRoutesType,
  group,
  operations,
  pathDeserializers,
  pathSerializers,
  pathTypes,
  queryDeserializers,
  querySerializers,
  queryTypes,
  requestBodyValidators,
  requestHeadersDeserializers,
  requestHeadersSerializers,
  requestHeadersTypes,
  requestServerTypes,
  requestTypes,
  responseBodyValidators,
  responseHeadersDeserializers,
  responseHeadersSerializers,
  responseHeadersTypes,
  responseTypes,
  sdkImpl,
  sdkType,
} as const
