import { ApiTypeGeneratorConfig } from './api-type'

import {
  TypeGuardGeneratorConfig,
  TypesGeneratorConfig,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-generators'
import { Config, OpenAPICodeGenerator } from './types'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { generatorFactoryMap } from './generatorFactoryMap'
import { ParameterTypesGeneratorConfig } from './utils/parameterTypings'
import { SdkGeneratorConfig } from './utils/sdkTypings'
import { group } from './group'
import { ResponseTypesGeneratorConfig } from './response-type'
import { ExpressRouterFactoriesGeneratorConfig } from './express-router-factory'
import { CorsConfigurationGeneratorConfig } from './cors-configuration'
import { OperationsGeneratorConfig } from './operations'

function create(name: 'oats/type', config?: Config<TypesGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/type-guard', config?: Config<TypeGuardGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/type-validator', config?: Config<ValidatorsGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/api-type', config?: Config<ApiTypeGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/sdk-type', config?: Config<SdkGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/sdk-impl', config?: Config<SdkGeneratorConfig>): OpenAPICodeGenerator
function create(
  name: 'oats/express-router-factory',
  config?: Config<ExpressRouterFactoriesGeneratorConfig>,
): OpenAPICodeGenerator
function create(name: 'oats/operation', config?: Config<OperationsGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/path-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/cookies-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/query-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPICodeGenerator
function create(name: 'oats/request-headers-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPICodeGenerator
function create(
  name: 'oats/response-headers-type',
  config?: Config<ParameterTypesGeneratorConfig>,
): OpenAPICodeGenerator
function create(name: 'oats/response-type', config?: Config<ResponseTypesGeneratorConfig>): OpenAPICodeGenerator
function create(
  name: 'oats/cors-configuration',
  config?: Config<CorsConfigurationGeneratorConfig>,
): OpenAPICodeGenerator
function create(name: OpenAPIGeneratorTarget, config?: Config): OpenAPICodeGenerator

function create(name: OpenAPIGeneratorTarget, config?: Config): OpenAPICodeGenerator {
  const factory = generatorFactoryMap[name]
  if (isNil(factory)) {
    throw new Error(`Unknown OpenAPI generator "${name}"`)
  }
  return isNil(config) ? factory() : factory(config)
}

export const generators = { create, group }
