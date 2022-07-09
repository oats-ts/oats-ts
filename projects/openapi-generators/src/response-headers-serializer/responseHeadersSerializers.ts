import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ResponseHeadersSerializersGenerator } from './ResponseHeadersSerializersGenerator'

export function responseHeadersSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeadersSerializersGenerator(config)
}
