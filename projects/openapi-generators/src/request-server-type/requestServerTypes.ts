import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { RequestServerTypesGenerator } from './RequestServerTypeGenerator'

export function requestServerTypes(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestServerTypesGenerator(config)
}
