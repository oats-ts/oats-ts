import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { TypeValidatorsGenerator } from './type/TypeValidatorsGenerator'
import { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
import { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'

export { TypeValidatorsGenerator } from './type/TypeValidatorsGenerator'
export { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
export { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'

export function typeValidators(config: GeneratorConfig & ValidatorsGeneratorConfig): OpenAPIGenerator {
  return new TypeValidatorsGenerator(config)
}

export function responseBodyValidators(config: GeneratorConfig): OpenAPIGenerator {
  return new ResponseBodyValidatorsGenerator(config)
}

export function requestBodyValidators(config: GeneratorConfig): OpenAPIGenerator {
  return new RequestBodyValidatorsGenerator(config)
}
