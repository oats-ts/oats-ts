import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { RequestHeadersSerializersGenerator } from './RequestHeadersSerializersGenerator'

export function requestHeadersSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestHeadersSerializersGenerator(config)
}
