import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { RequestTypesGenerator } from './RequestTypesGenerator'

export function requestTypes(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestTypesGenerator(config)
}
