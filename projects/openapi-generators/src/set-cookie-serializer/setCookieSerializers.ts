import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { SetCookieSerializersGenerator } from './SetCookieSerializersGenerator'

export function setCookieSerializers(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new SetCookieSerializersGenerator(config)
}
