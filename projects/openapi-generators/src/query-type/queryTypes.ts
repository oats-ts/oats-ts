import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameterTypings'
import { QueryTypesGenerator } from './QueryTypesGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<ParameterTypesGeneratorConfig & GeneratorConfig>): ParameterTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function queryTypes(config: Partial<ParameterTypesGeneratorConfig & GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new QueryTypesGenerator(defaultConfig(config))
}
