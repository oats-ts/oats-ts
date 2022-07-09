import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ResponseHeadersDeserializersGenerator } from './ResponseHeadersDeserializersGenerator'

export function responseHeadersDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeadersDeserializersGenerator(config)
}
