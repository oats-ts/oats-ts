import { RequestBodyValidatorsGenerator } from './RequestBodyValidatorsGenerator'

export function requestBodyValidators(): RequestBodyValidatorsGenerator {
  return new RequestBodyValidatorsGenerator()
}
