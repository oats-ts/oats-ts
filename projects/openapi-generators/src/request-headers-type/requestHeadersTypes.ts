import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameterTypings'
import { RequestHeadersTypesGenerator } from './RequestHeadersTypesGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<ParameterTypesGeneratorConfig & GeneratorConfig>): ParameterTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function requestHeadersTypes(
  config: Partial<ParameterTypesGeneratorConfig & Partial<GeneratorConfig>> = {},
): OpenAPICodeGenerator {
  return new RequestHeadersTypesGenerator(defaultConfig(config))
}
