import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
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

export function queryTypes(config: Partial<ParameterTypesGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new QueryTypesGenerator(defaultConfig(config))
}
