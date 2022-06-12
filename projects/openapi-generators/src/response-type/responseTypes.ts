import { OpenAPIGenerator } from '../types'
import { ResponseTypesGenerator } from './ResponseTypesGenerator'

export function responseTypes(): OpenAPIGenerator {
  return new ResponseTypesGenerator()
}
