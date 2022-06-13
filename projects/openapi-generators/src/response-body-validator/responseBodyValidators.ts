import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ResponseBodyValidatorsGenerator } from './ResponseBodyValidatorsGenerator'

export function responseBodyValidators(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseBodyValidatorsGenerator(config)
}
