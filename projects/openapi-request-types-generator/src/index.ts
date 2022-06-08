import { RequestTypesGenerator } from './requestType/RequestTypesGenerator'
import { RequestServerTypesGenerator } from './requestServerType/RequestServerTypeGenerator'

export { RequestTypesGenerator } from './requestType/RequestTypesGenerator'

export function requestTypes(): RequestTypesGenerator {
  return new RequestTypesGenerator()
}

export function requestServerTypes(): RequestServerTypesGenerator {
  return new RequestServerTypesGenerator()
}
