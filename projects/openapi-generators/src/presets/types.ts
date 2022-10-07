import { GeneratorConfig } from '@oats-ts/oats-ts'
import {
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

export type PresetGeneratorConfiguration = {
  [K in OpenAPIGeneratorTarget]?: K extends keyof GeneratorConfigs ? Config<GeneratorConfigs[K]> : Config
}

export type PresetConfiguration = Partial<GeneratorConfig> & {
  overrides?: PresetGeneratorConfiguration
}
