import { RequestHeadersDeserializersGenerator } from './RequestHeadersDeserializersGenerator'

export function requestHeadersDeserializers(): RequestHeadersDeserializersGenerator {
  return new RequestHeadersDeserializersGenerator()
}
