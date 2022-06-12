import { OpenAPIGenerator } from '../types'
import { ResponseHeadersDeserializersGenerator } from './ResponseHeadersDeserializersGenerator'

export function responseHeadersDeserializers(): OpenAPIGenerator {
  return new ResponseHeadersDeserializersGenerator()
}
