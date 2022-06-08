import { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'
import { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'

export { ResponseBodyValidatorsGenerator } from './responseBody/ResponseBodyValidatorsGenerator'
export { RequestBodyValidatorsGenerator } from './requestBody/RequestBodyValidatorsGenerator'
export { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'

export function responseBodyValidators(): ResponseBodyValidatorsGenerator {
  return new ResponseBodyValidatorsGenerator()
}

export function requestBodyValidators(): RequestBodyValidatorsGenerator {
  return new RequestBodyValidatorsGenerator()
}
