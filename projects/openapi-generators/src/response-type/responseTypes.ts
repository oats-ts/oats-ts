import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ResponseTypesGenerator } from './ResponseTypesGenerator'

export function responseTypes(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseTypesGenerator(config)
}
