import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { RequestBodyValidatorsGenerator } from './RequestBodyValidatorsGenerator'

export function requestBodyValidators(config: Partial<GeneratorConfig>): OpenAPIGenerator {
  return new RequestBodyValidatorsGenerator(config)
}
