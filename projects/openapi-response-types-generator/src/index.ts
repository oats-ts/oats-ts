import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ResponseTypesGenerator } from './ResponseTypesGenerator'

export { ResponseTypesGenerator } from './ResponseTypesGenerator'

export function responseTypes(): OpenAPIGenerator {
  return new ResponseTypesGenerator()
}
