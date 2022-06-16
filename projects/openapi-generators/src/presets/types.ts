import { GeneratorConfig } from '@oats-ts/generator'
import {
  TypeGuardGeneratorConfig,
  TypesGeneratorConfig,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-generators'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ApiTypeGeneratorConfig } from '../api-type'
import { ExpressRoutesGeneratorConfig } from '../express-route'
import { OperationsGeneratorConfig } from '../operations'
import { SdkImplGeneratorConfig } from '../sdk-impl'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { SdkGeneratorConfig } from '../utils/sdk/typings'

export type Config<T = {}> = boolean | (Partial<GeneratorConfig> & Partial<T>)

type GeneratorConfigs = {
  'openapi/api-type': ApiTypeGeneratorConfig
  'openapi/express-route': ExpressRoutesGeneratorConfig
  'openapi/operation': OperationsGeneratorConfig
  'openapi/path-type': ParameterTypesGeneratorConfig
  'openapi/query-type': ParameterTypesGeneratorConfig
  'openapi/request-headers-type': ParameterTypesGeneratorConfig
  'openapi/sdk-type': SdkGeneratorConfig
  'openapi/sdk-impl': SdkImplGeneratorConfig
  'json-schema/type': TypesGeneratorConfig
  'json-schema/type-guard': TypeGuardGeneratorConfig
  'json-schema/type-validator': ValidatorsGeneratorConfig
  'openapi/response-headers-type': ParameterTypesGeneratorConfig
}

export type PresetGeneratorConfiguration = {
  [K in OpenAPIGeneratorTarget]?: K extends keyof GeneratorConfigs ? Config<GeneratorConfigs[K]> : Config
}

export type PresetConfiguration = Partial<GeneratorConfig> & {
  overrides?: PresetGeneratorConfiguration
}
