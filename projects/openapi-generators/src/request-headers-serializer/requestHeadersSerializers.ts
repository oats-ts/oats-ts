import { RequestHeadersSerializersGenerator } from './RequestHeadersSerializersGenerator'

export function requestHeadersSerializers(): RequestHeadersSerializersGenerator {
  return new RequestHeadersSerializersGenerator()
}
