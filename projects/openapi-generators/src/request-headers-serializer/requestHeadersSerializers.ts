import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestHeadersSerializersGenerator } from './RequestHeadersSerializersGenerator'

export function requestHeadersSerializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new RequestHeadersSerializersGenerator(config)
}
