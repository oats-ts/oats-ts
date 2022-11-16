import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { CookieDeserializersGenerator } from './CookieDeserializersGenerator'

export function cookieDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new CookieDeserializersGenerator(config)
}
