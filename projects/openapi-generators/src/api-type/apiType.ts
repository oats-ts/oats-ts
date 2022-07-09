import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ApiTypeGenerator } from './ApiTypeGenerator'
import { ApiTypeGeneratorConfig } from './typings'

function defaultConfig({
  documentation,
  ...rest
}: Partial<ApiTypeGeneratorConfig>): ApiTypeGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function apiType(config: Partial<GeneratorConfig & ApiTypeGeneratorConfig> = {}): OpenAPIGenerator {
  return new ApiTypeGenerator(defaultConfig(config))
}
