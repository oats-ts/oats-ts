import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { RequestTypesGenerator } from './requestType/RequestTypesGenerator'
import { RequestServerTypesGenerator } from './requestServerType/RequestServerTypeGenerator'

export { RequestTypesGenerator } from './requestType/RequestTypesGenerator'

export function requestTypes(): OpenAPIGenerator {
  return new RequestTypesGenerator()
}

export function requestServerTypes(): OpenAPIGenerator {
  return new RequestServerTypesGenerator()
}
