import {
  TraversalHelper,
  TypeGuardGeneratorConfig,
  TypesGeneratorConfig,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-generators'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ApiTypeGeneratorConfig } from '../api-type'
import { ExpressRouterFactoriesGeneratorConfig } from '../express-router-factory'
import { OperationsGeneratorConfig } from '../operations'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { Config } from '../types'
import { RequestTypesGeneratorConfig } from '../request-type/typings'
import { ResponseTypesGeneratorConfig } from '../response-type'
import { ExpressCorsRouterFactoryGeneratorConfig } from '../express-cors-router-factory'
import { CorsConfigurationGeneratorConfig } from '../cors-configuration/typings'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

type GeneratorConfigs = {
  'oats/api-type': ApiTypeGeneratorConfig
  'oats/operation': OperationsGeneratorConfig
  'oats/path-type': ParameterTypesGeneratorConfig
  'oats/query-type': ParameterTypesGeneratorConfig
  'oats/request-headers-type': ParameterTypesGeneratorConfig
  'oats/cookies-type': ParameterTypesGeneratorConfig
  'oats/sdk-type': SdkGeneratorConfig
  'oats/sdk-impl': SdkGeneratorConfig
  'oats/type': TypesGeneratorConfig
  'oats/type-guard': TypeGuardGeneratorConfig
  'oats/type-validator': ValidatorsGeneratorConfig
  'oats/response-headers-type': ParameterTypesGeneratorConfig
  'oats/request-type': RequestTypesGeneratorConfig
  'oats/response-type': ResponseTypesGeneratorConfig
  'oats/express-router-factory': ExpressRouterFactoriesGeneratorConfig
  'oats/express-cors-router-factory': ExpressCorsRouterFactoryGeneratorConfig
  'oats/cors-configuration': CorsConfigurationGeneratorConfig
}

export type OpenAPIPresetConfig = {
  [K in OpenAPIGeneratorTarget]?: K extends keyof GeneratorConfigs ? Config<GeneratorConfigs[K]> : Config
}

export type OpenAPICommonPresetConfig = {
  /**
   * When enabled, documentation from description, summary and deprecated fields
   * will be generated on all artifacts that support this.
   */
  documentation?: boolean
  /**
   * Called for every schema and reference, and in case it returns true, validator for the given
   * schema will be omited.
   *
   * This can result in performance gains, in case the validator would have to iterate on a huge
   * array or a record with many key-value pairs
   */
  ignoreValidator?: (schema: Referenceable<SchemaObject>, helper: TraversalHelper) => boolean
  /**
   * Called for every schema and reference, and in case it returns true, type guard checks for the given
   * schema will be omited.
   *
   * This can result in performance gains, in case the type guard check would have to iterate on a huge
   * array or a record with many key-value pairs
   */
  ignoreTypeGuard?: (schema: Referenceable<SchemaObject>, helper: TraversalHelper) => boolean
}

export type OpenAPIClientPresetConfig = OpenAPICommonPresetConfig & {
  /**
   * When enabled, client Request and Response types will have an optional cookies field,
   * and the client side SDK will attempt to construct the Cookie header directly from the request,
   * and deserialize the Set-Cookie header directly from the response.
   *
   * This will only work on node or non-browser environments, in the browser cookie-related headers
   * are not available. It's only recommended for API testing, as otherwise it's difficult to test
   * cookies from a node environment.
   */
  debugCookies?: boolean
  /**
   * When enabled, the client side SDK will attempt to validate response bodies.
   *
   * Use this if you don't trust, that the server will respect the source OpenAPI document.
   */
  validateResponses?: boolean
}

export type OpenAPIServerPresetConfig = OpenAPICommonPresetConfig & {
  /**
   * When enabled, CORS tooling will be generated on the server side.
   *
   * This includes CORS configuration, and a CORS router, that can be used configuration-free
   * to set proper pre-flight headers, and response headers directly.
   *
   * - When true, all origins will be enabled. Use this sparingly for tests, or for public APIs.
   * - When an array of strings, the given array elements will be used as allowed origins,
   *   and all request headers, response headers and methods listed in the source OpenAPI document
   *   will be allowed
   * - When an object, you can influence each aspect of the CORS headers.
   */
  cors?: boolean | string[] | Partial<CorsConfigurationGeneratorConfig>
}

export type OpenAPIFullStackPresetConfig = OpenAPIClientPresetConfig & OpenAPIServerPresetConfig
