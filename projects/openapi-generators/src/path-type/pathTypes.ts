import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameterTypings'
import { PathTypesGenerator } from './PathTypesGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<ParameterTypesGeneratorConfig & GeneratorConfig>): ParameterTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function pathTypes(config: Partial<ParameterTypesGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new PathTypesGenerator(defaultConfig(config))
}
