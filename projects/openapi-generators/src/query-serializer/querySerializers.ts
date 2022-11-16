import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { QuerySerializersGenerator } from './QuerySerializersGenerator'

export function querySerializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new QuerySerializersGenerator(config)
}
