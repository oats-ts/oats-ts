import { OpenAPIGenerator } from '../types'
import { RequestHeadersSerializersGenerator } from './RequestHeadersSerializersGenerator'

export function requestHeadersSerializers(): OpenAPIGenerator {
  return new RequestHeadersSerializersGenerator()
}
