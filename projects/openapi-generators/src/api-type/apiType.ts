import { ApiTypeGenerator } from './ApiTypeGenerator'
import { ApiTypeGeneratorConfig } from './typings'

export type { ApiTypeGeneratorConfig } from './typings'
export { ApiTypeGenerator } from './ApiTypeGenerator'

function defaultConfig(config: Partial<ApiTypeGeneratorConfig>): ApiTypeGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function apiType(config: Partial<ApiTypeGeneratorConfig> = {}): ApiTypeGenerator {
  return new ApiTypeGenerator(defaultConfig(config))
}