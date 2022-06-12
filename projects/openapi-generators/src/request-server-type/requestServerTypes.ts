import { RequestServerTypesGenerator } from './RequestServerTypeGenerator'

export function requestServerTypes(): RequestServerTypesGenerator {
  return new RequestServerTypesGenerator()
}
