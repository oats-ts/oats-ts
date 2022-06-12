import { OpenAPIGenerator } from '../types'
import { ApiTypeGenerator } from './ApiTypeGenerator'
import { ApiTypeGeneratorConfig } from './typings'

function defaultConfig({ documentation, ...rest }: Partial<ApiTypeGeneratorConfig>): ApiTypeGeneratorConfig {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function apiType(config: Partial<ApiTypeGeneratorConfig> = {}): OpenAPIGenerator {
  return new ApiTypeGenerator(defaultConfig(config))
}
