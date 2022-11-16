import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestHeadersDeserializersGenerator } from './RequestHeadersDeserializersGenerator'

export function requestHeadersDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new RequestHeadersDeserializersGenerator(config)
}
