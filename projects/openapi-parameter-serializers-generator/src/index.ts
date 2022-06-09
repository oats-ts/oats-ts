import { InputParameterSerializerGenerator } from './InputParameterSerializerGenerator'
import { ResponseHeadersParameterSerializersGenerator } from './responseHeaders/ResponseHeadersParameterSerializersGenerator'

export { ResponseHeadersParameterSerializersGenerator } from './responseHeaders/ResponseHeadersParameterSerializersGenerator'

export class QueryParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/query-serializer', 'openapi/query-type', 'query')
  }
}

export class PathParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/path-serializer', 'openapi/path-type', 'path')
  }
}

export class RequestHeaderParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/request-headers-serializer', 'openapi/request-headers-type', 'header')
  }
}

export function queryParameterSerializers(): QueryParameterSerializersGenerator {
  return new QueryParameterSerializersGenerator()
}

export function pathParameterSerializers(): PathParameterSerializersGenerator {
  return new PathParameterSerializersGenerator()
}

export function requestHeaderParameterSerializers(): RequestHeaderParameterSerializersGenerator {
  return new RequestHeaderParameterSerializersGenerator()
}

export function responseHeaderParameterSerializers(): ResponseHeadersParameterSerializersGenerator {
  return new ResponseHeadersParameterSerializersGenerator()
}
