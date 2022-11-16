import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseServerTypesGenerator } from './ResponseServerTypesGenerator'

export function responseServerTypes(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseServerTypesGenerator(config)
}
