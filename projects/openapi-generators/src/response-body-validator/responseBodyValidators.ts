import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseBodyValidatorsGenerator } from './ResponseBodyValidatorsGenerator'

export function responseBodyValidators(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseBodyValidatorsGenerator(config)
}
