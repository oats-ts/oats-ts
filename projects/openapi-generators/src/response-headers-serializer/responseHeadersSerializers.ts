import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseHeadersSerializersGenerator } from './ResponseHeadersSerializersGenerator'

export function responseHeadersSerializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseHeadersSerializersGenerator(config)
}
