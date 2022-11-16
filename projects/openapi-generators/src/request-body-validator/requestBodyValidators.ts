import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestBodyValidatorsGenerator } from './RequestBodyValidatorsGenerator'

export function requestBodyValidators(config: Partial<GeneratorConfig>): OpenAPICodeGenerator {
  return new RequestBodyValidatorsGenerator(config)
}
