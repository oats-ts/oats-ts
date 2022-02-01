import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'
import { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'

export { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
export { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'
export { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'

export function responseBodyValidators(): OpenAPIGenerator {
  return new ResponseBodyValidatorsGenerator()
}

export function requestBodyValidators(): OpenAPIGenerator {
  return new RequestBodyValidatorsGenerator()
}
