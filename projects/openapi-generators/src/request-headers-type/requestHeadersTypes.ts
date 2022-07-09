import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
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
): OpenAPIGenerator {
  return new RequestHeadersTypesGenerator(defaultConfig(config))
}
