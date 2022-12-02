import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { PathParametersGenerator } from './PathParametersGenerator'

export function pathParameters(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new PathParametersGenerator(config)
}
