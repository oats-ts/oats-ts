import { ResponseBodyValidatorsGenerator } from './ResponseBodyValidatorsGenerator'

export function responseBodyValidators(): ResponseBodyValidatorsGenerator {
  return new ResponseBodyValidatorsGenerator()
}
