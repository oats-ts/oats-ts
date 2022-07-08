import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
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
