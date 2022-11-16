import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { CookieSerializersGenerator } from './CookieSerializersGenerator'

export function cookieSerializers(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new CookieSerializersGenerator(config)
}
