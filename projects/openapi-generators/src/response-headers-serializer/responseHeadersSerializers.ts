import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ResponseHeadersSerializersGenerator } from './ResponseHeadersSerializersGenerator'

export function responseHeadersSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeadersSerializersGenerator(config)
}
