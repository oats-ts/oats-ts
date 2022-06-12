import { OpenAPIGenerator } from '../types'
import { RequestBodyValidatorsGenerator } from './RequestBodyValidatorsGenerator'

export function requestBodyValidators(): OpenAPIGenerator {
  return new RequestBodyValidatorsGenerator()
}
