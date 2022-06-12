import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { QueryTypesGenerator } from './QueryTypesGenerator'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function queryTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new QueryTypesGenerator(defaultConfig(config))
}
