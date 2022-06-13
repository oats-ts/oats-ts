import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { QueryDeserializersGenerator } from './QueryDeserializersGenerator'

export function queryDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new QueryDeserializersGenerator(config)
}
