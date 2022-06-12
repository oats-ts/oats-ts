import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { ResponseHeadersTypesGenerator } from './ResponseHeadersTypesGenerator'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function responseHeadersTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeadersTypesGenerator(defaultConfig(config))
}
