import { OpenAPIGenerator } from '../types'
import { RequestServerTypesGenerator } from './RequestServerTypeGenerator'

export function requestServerTypes(): OpenAPIGenerator {
  return new RequestServerTypesGenerator()
}
