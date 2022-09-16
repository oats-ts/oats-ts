import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ResponseServerTypesGenerator } from './ResponseServerTypesGenerator'

export function responseServerTypes(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseServerTypesGenerator(config)
}
