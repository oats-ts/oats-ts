import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { QueryDeserializersGenerator } from './QueryDeserializersGenerator'

export function queryDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new QueryDeserializersGenerator(config)
}
