import { apiType } from './api-type'
import { expressRouterFactories } from './express-router-factory'
import { expressAppRouterFactory } from './express-app-router-factory'
import { expressRoutersFactoriesType } from './express-router-factories-type'
import { group } from './group'
import { operations } from './operation-functions'
import { operations as operationClasses } from './operations'
import { pathDeserializers } from './path-deserializer'
import { pathSerializers } from './path-serializer'
import { pathTypes } from './path-type'
import { queryDeserializers } from './query-deserializer'
import { querySerializers } from './query-serializer'
import { queryTypes } from './query-type'
import { cookiesTypes } from './cookies-type'
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
import { responseServerTypes } from './response-server-type'
import { cookieSerializers } from './cookie-serializer'
import { cookieDeserializers } from './cookie-deserializer'
import { expressCorsRouterFactory } from './express-cors-router-factory'
import { typeGuards, types, typeValidators } from '@oats-ts/json-schema-generators'
import { expressContextRouterFactory } from './express-context-router-factory'
import { corsConfiguration } from './cors-configuration'
import { cookieParameters } from './cookie-parameters'
import { pathParameters } from './path-parameters'
import { queryParameters } from './query-parameters'
import { requestHeaderParameters } from './request-header-parameters'

export const factories = {
  typeGuards,
  types,
  typeValidators,
  apiType,
  expressRouterFactories,
  expressAppRouterFactory,
  expressRoutersFactoriesType,
  group,
  operations,
  pathDeserializers,
  pathSerializers,
  pathTypes,
  cookieSerializers,
  cookieDeserializers,
  cookiesTypes,
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
  responseServerTypes,
  sdkImpl,
  sdkType,
  expressCorsRouterFactory,
  expressContextRouterFactory,
  corsConfiguration,
  operationClasses,
  cookieParameters,
  pathParameters,
  queryParameters,
  requestHeaderParameters,
} as const
