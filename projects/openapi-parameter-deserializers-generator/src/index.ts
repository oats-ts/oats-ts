import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterDeserializersGenerator } from './InputParameterDeserializersGenerator'
import { ResponseHeadersParameterDeserializersGenerator } from './responseHeaders/ResponseHeadersParameterDeserializersGenerator'

export class QueryParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/query-deserializer'> {
  constructor() {
    super('openapi/query-deserializer', 'openapi/query-type', 'query')
  }
}

export class PathParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/path-deserializer'> {
  constructor() {
    super('openapi/path-deserializer', 'openapi/path-type', 'path')
  }
}

export class RequestHeaderParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/request-headers-deserializer'> {
  constructor() {
    super('openapi/request-headers-deserializer', 'openapi/request-headers-type', 'header')
  }
}

export function queryParameterDeserializers(): OpenAPIGenerator {
  return new QueryParameterDeserializersGenerator()
}

export function pathParameterDeserializers(): OpenAPIGenerator {
  return new PathParameterDeserializersGenerator()
}

export function requestHeaderParameterDeserializers(): OpenAPIGenerator {
  return new RequestHeaderParameterDeserializersGenerator()
}

export function responseHeaderParameterDeserializers(): OpenAPIGenerator {
  return new ResponseHeadersParameterDeserializersGenerator()
}
