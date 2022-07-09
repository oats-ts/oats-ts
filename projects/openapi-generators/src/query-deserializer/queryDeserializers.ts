import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { QueryDeserializersGenerator } from './QueryDeserializersGenerator'

export function queryDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new QueryDeserializersGenerator(config)
}
