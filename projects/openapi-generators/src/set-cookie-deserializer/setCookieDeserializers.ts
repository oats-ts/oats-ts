import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { SetCookieDeserializersGenerator } from './SetCookieDeserializersGenerator'

export function setCookieDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new SetCookieDeserializersGenerator(config)
}
