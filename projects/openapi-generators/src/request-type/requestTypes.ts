import { OpenAPIGenerator } from '../types'
import { RequestTypesGenerator } from './RequestTypesGenerator'

export function requestTypes(): OpenAPIGenerator {
  return new RequestTypesGenerator()
}
