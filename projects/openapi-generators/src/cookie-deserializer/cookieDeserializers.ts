import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { CookieDeserializersGenerator } from './CookieDeserializersGenerator'

export function cookieDeserializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new CookieDeserializersGenerator(config)
}
