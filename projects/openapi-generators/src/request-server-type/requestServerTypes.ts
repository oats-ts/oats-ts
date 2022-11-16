import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestServerTypesGenerator } from './RequestServerTypeGenerator'

export function requestServerTypes(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new RequestServerTypesGenerator(config)
}
