import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { QuerySerializersGenerator } from './QuerySerializersGenerator'

export function querySerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new QuerySerializersGenerator(config)
}
