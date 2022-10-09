import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameterTypings'
import { ResponseHeadersTypesGenerator } from './ResponseHeadersTypesGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<ParameterTypesGeneratorConfig & GeneratorConfig>): ParameterTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function responseHeadersTypes(
  config: Partial<ParameterTypesGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ResponseHeadersTypesGenerator(defaultConfig(config))
}
