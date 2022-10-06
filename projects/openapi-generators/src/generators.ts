import { ApiTypeGeneratorConfig } from './api-type'

import { OperationsGeneratorConfig } from './operations'
import {
  TypeGuardGeneratorConfig,
  TypesGeneratorConfig,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-generators'
import { Config, OpenAPIGenerator } from './types'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { generatorFactoryMap } from './generatorFactoryMap'
import { ParameterTypesGeneratorConfig } from './utils/parameters/typings'
import { SdkGeneratorConfig } from './utils/sdk/typings'
import { group } from './group'
import { ResponseTypesGeneratorConfig } from './response-type'
import { ExpressRouterFactoriesGeneratorConfig } from './express-router-factory'

function create(name: 'oats/type', config?: Config<TypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/type-guard', config?: Config<TypeGuardGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/type-validator', config?: Config<ValidatorsGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/api-type', config?: Config<ApiTypeGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/sdk-type', config?: Config<SdkGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/sdk-impl', config?: Config<SdkGeneratorConfig>): OpenAPIGenerator
function create(
  name: 'oats/express-router-factory',
  config?: Config<ExpressRouterFactoriesGeneratorConfig>,
): OpenAPIGenerator
function create(name: 'oats/operation', config?: Config<OperationsGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/path-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/cookies-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/query-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/request-headers-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/response-headers-type', config?: Config<ParameterTypesGeneratorConfig>): OpenAPIGenerator
function create(name: 'oats/response-type', config?: Config<ResponseTypesGeneratorConfig>): OpenAPIGenerator

function create(name: OpenAPIGeneratorTarget, config?: Config): OpenAPIGenerator {
  const factory = generatorFactoryMap[name]
  if (isNil(factory)) {
    throw new Error(`Unknown OpenAPI generator "${name}"`)
  }
  return isNil(config) ? factory() : factory(config)
}

export const generators = { create, group }
