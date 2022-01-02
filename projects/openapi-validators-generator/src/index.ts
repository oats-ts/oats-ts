import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { TypeValidatorsGenerator } from './type/TypeValidatorsGenerator'
import { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
import { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'

export { TypeValidatorsGenerator } from './type/TypeValidatorsGenerator'
export { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
export { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'
export { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'

export function typeValidators(config: ValidatorsGeneratorConfig): OpenAPIGenerator {
  return new TypeValidatorsGenerator(config)
}

export function responseBodyValidators(): OpenAPIGenerator {
  return new ResponseBodyValidatorsGenerator()
}

export function requestBodyValidators(): OpenAPIGenerator {
  return new RequestBodyValidatorsGenerator()
}
