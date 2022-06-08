import { InputParameterDeserializersGenerator } from './InputParameterDeserializersGenerator'
import { ResponseHeadersParameterDeserializersGenerator } from './responseHeaders/ResponseHeadersParameterDeserializersGenerator'

export class QueryParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/query-deserializer', 'openapi/query-type', 'query')
  }
}

export class PathParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/path-deserializer', 'openapi/path-type', 'path')
  }
}

export class RequestHeaderParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/request-headers-deserializer', 'openapi/request-headers-type', 'header')
  }
}

export function queryParameterDeserializers(): QueryParameterDeserializersGenerator {
  return new QueryParameterDeserializersGenerator()
}

export function pathParameterDeserializers(): PathParameterDeserializersGenerator {
  return new PathParameterDeserializersGenerator()
}

export function requestHeaderParameterDeserializers(): RequestHeaderParameterDeserializersGenerator {
  return new RequestHeaderParameterDeserializersGenerator()
}

export function responseHeaderParameterDeserializers(): ResponseHeadersParameterDeserializersGenerator {
  return new ResponseHeadersParameterDeserializersGenerator()
}
