import { GeneratorConfig } from '@oats-ts/oats-ts'
import {
  TypeGuardGeneratorConfig,
  TypesGeneratorConfig,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-generators'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ApiTypeGeneratorConfig } from '../api-type'
import { ExpressRoutesGeneratorConfig } from '../express-router'
import { OperationsGeneratorConfig } from '../operations'
import { SdkImplGeneratorConfig } from '../sdk-impl'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { Config } from '../types'
import { RequestTypesGeneratorConfig } from '../request-type/typings'
import { ResponseTypesGeneratorConfig } from '../response-type'
import { ExpressCorsMiddlewareGeneratorConfig } from '../express-cors-middleware'

type GeneratorConfigs = {
  'oats/api-type': ApiTypeGeneratorConfig
  'oats/express-router': ExpressRoutesGeneratorConfig
  'oats/operation': OperationsGeneratorConfig
  'oats/path-type': ParameterTypesGeneratorConfig
  'oats/query-type': ParameterTypesGeneratorConfig
  'oats/request-headers-type': ParameterTypesGeneratorConfig
  'oats/sdk-type': SdkGeneratorConfig
  'oats/sdk-impl': SdkImplGeneratorConfig
  'oats/type': TypesGeneratorConfig
  'oats/type-guard': TypeGuardGeneratorConfig
  'oats/type-validator': ValidatorsGeneratorConfig
  'oats/response-headers-type': ParameterTypesGeneratorConfig
  'oats/request-type': RequestTypesGeneratorConfig
  'oats/response-type': ResponseTypesGeneratorConfig
  'oats/express-cors-middleware': ExpressCorsMiddlewareGeneratorConfig
}

export type PresetGeneratorConfiguration = {
  [K in OpenAPIGeneratorTarget]?: K extends keyof GeneratorConfigs ? Config<GeneratorConfigs[K]> : Config
}

export type BasePresetConfiguration = Partial<GeneratorConfig> & {
  overrides?: PresetGeneratorConfiguration
}

export type ConfigProducer<T> = (
  defaultConfig: PresetGeneratorConfiguration,
  config?: T,
) => PresetGeneratorConfiguration
