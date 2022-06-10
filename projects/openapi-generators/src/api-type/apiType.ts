import { ApiTypeGenerator } from './ApiTypeGenerator'
import { ApiTypeGeneratorConfig } from './typings'

function defaultConfig(config: Partial<ApiTypeGeneratorConfig>): ApiTypeGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function apiType(config: Partial<ApiTypeGeneratorConfig> = {}): ApiTypeGenerator {
  return new ApiTypeGenerator(defaultConfig(config))
}
