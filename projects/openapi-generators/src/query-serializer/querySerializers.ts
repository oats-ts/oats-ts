import { OpenAPIGenerator } from '../types'
import { QuerySerializersGenerator } from './QuerySerializersGenerator'

export function querySerializers(): OpenAPIGenerator {
  return new QuerySerializersGenerator()
}
