import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseHeaderParametersGenerator } from './ResponseHeaderParametersGenerator'

export function responseHeaderParameters(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseHeaderParametersGenerator(config)
}
