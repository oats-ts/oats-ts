import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { CookieSerializersGenerator } from './CookieSerializersGenerator'

export function cookieSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new CookieSerializersGenerator(config)
}
