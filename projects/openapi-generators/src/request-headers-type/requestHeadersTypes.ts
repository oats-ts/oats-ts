import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { RequestHeadersTypesGenerator } from './RequestHeadersTypesGenerator'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function requestHeadersTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): RequestHeadersTypesGenerator {
  return new RequestHeadersTypesGenerator(defaultConfig(config))
}
