import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { PathSerializersGenerator } from './PathSerializersGenerator'

export function pathSerializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new PathSerializersGenerator(config)
}
