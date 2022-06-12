import { OpenAPIGenerator } from '../types'
import { ResponseHeadersSerializersGenerator } from './ResponseHeadersSerializersGenerator'

export function responseHeadersSerializers(): OpenAPIGenerator {
  return new ResponseHeadersSerializersGenerator()
}
