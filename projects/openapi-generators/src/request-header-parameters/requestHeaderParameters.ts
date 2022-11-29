import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestHeaderParametersGenerator } from './RequestHeaderParametersGenerator'

export function requestHeaderParameters(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new RequestHeaderParametersGenerator(config)
}
