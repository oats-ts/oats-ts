import { OpenAPIGenerator } from '../types'
import { RequestHeadersDeserializersGenerator } from './RequestHeadersDeserializersGenerator'

export function requestHeadersDeserializers(): OpenAPIGenerator {
  return new RequestHeadersDeserializersGenerator()
}
