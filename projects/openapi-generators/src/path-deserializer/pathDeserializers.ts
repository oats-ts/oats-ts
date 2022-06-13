import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { PathDeserializersGenerator } from './PathDeserializersGenerator'

export function pathDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new PathDeserializersGenerator(config)
}
