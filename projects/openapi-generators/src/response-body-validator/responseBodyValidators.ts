import { OpenAPIGenerator } from '../types'
import { ResponseBodyValidatorsGenerator } from './ResponseBodyValidatorsGenerator'

export function responseBodyValidators(): OpenAPIGenerator {
  return new ResponseBodyValidatorsGenerator()
}
