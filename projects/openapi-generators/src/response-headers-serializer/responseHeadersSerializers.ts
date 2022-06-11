import { ResponseHeadersSerializersGenerator } from './ResponseHeadersSerializersGenerator'

export function responseHeadersSerializers(): ResponseHeadersSerializersGenerator {
  return new ResponseHeadersSerializersGenerator()
}
