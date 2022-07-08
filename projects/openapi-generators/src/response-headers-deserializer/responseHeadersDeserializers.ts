import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ResponseHeadersDeserializersGenerator } from './ResponseHeadersDeserializersGenerator'

export function responseHeadersDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeadersDeserializersGenerator(config)
}
