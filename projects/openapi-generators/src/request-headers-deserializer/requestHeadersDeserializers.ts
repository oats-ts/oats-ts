import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { RequestHeadersDeserializersGenerator } from './RequestHeadersDeserializersGenerator'

export function requestHeadersDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestHeadersDeserializersGenerator(config)
}
