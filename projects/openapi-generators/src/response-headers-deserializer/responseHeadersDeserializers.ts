import { ResponseHeadersDeserializersGenerator } from './ResponseHeadersDeserializersGenerator'

export function responseHeadersDeserializers(): ResponseHeadersDeserializersGenerator {
  return new ResponseHeadersDeserializersGenerator()
}
