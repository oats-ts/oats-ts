import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { CookieParametersGenerator } from './CookieParametersGenerator'

export function cookieParameters(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new CookieParametersGenerator(config)
}
