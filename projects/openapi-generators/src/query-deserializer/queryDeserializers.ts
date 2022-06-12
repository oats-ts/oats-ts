import { OpenAPIGenerator } from '../types'
import { QueryDeserializersGenerator } from './QueryDeserializersGenerator'

export function queryDeserializers(): OpenAPIGenerator {
  return new QueryDeserializersGenerator()
}
