import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseHeadersDeserializersGenerator } from './ResponseHeadersDeserializersGenerator'

export function responseHeadersDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseHeadersDeserializersGenerator(config)
}
