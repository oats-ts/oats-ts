import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { PathDeserializersGenerator } from './PathDeserializersGenerator'

export function pathDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new PathDeserializersGenerator(config)
}
