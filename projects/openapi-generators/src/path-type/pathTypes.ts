import { OpenAPIGenerator } from '../types'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'
import { PathTypesGenerator } from './PathTypesGenerator'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function pathTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new PathTypesGenerator(defaultConfig(config))
}
