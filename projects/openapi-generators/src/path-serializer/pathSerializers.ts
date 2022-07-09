import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { PathSerializersGenerator } from './PathSerializersGenerator'

export function pathSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new PathSerializersGenerator(config)
}
