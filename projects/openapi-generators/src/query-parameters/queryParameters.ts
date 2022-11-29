import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { QueryParametersGenerator } from './QueryParametersGenerator'

export function queryParameters(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new QueryParametersGenerator(config)
}
