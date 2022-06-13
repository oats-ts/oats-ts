import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { RequestTypesGenerator } from './RequestTypesGenerator'

export function requestTypes(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestTypesGenerator(config)
}
