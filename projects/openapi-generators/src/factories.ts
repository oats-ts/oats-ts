import { apiType } from './api-type'
import { expressRouterFactories } from './express-router-factory'
import { expressAppRouterFactory } from './express-app-router-factory'
import { expressRoutersFactoriesType } from './express-router-factories-type'
import { group } from './group'
import { operations as operationClasses } from './operations'
import { pathTypes } from './path-type'
import { queryTypes } from './query-type'
import { cookiesTypes } from './cookies-type'
import { requestBodyValidators } from './request-body-validator'
import { requestHeadersTypes } from './request-headers-type'
import { requestServerTypes } from './request-server-type'
import { requestTypes } from './request-type'
import { responseBodyValidators } from './response-body-validator'
import { responseHeadersTypes } from './response-headers-type'
import { responseTypes } from './response-type'
import { sdkImpl } from './sdk-impl'
import { sdkType } from './sdk-type'
import { responseServerTypes } from './response-server-type'
import { expressCorsRouterFactory } from './express-cors-router-factory'
import { expressContextRouterFactory } from './express-context-router-factory'
import { corsConfiguration } from './cors-configuration'
import { cookieParameters } from './cookie-parameters'
import { pathParameters } from './path-parameters'
import { queryParameters } from './query-parameters'
import { requestHeaderParameters } from './request-header-parameters'
import { responseHeaderParameters } from './response-header-parameters'
import { types } from './type'
import { typeGuards } from './type-guard'
import { typeValidators } from './type-validator'

export const factories = {
  typeGuards,
  types,
  typeValidators,
  apiType,
  expressRouterFactories,
  expressAppRouterFactory,
  expressRoutersFactoriesType,
  group,
  pathTypes,
  cookiesTypes,
  queryTypes,
  requestBodyValidators,
  requestHeadersTypes,
  requestServerTypes,
  requestTypes,
  responseBodyValidators,
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
  responseHeaderParameters,
} as const
