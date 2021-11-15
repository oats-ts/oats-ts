import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterSerializerGenerator } from './InputParameterSerializerGenerator'
import { ResponseHeadersParameterSerializersGenerator } from './responseHeaders/ResponseHeadersParameterSerializersGenerator'

export { ResponseHeadersParameterSerializersGenerator } from './responseHeaders/ResponseHeadersParameterSerializersGenerator'

export class QueryParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/query-serializer'> {
  constructor() {
    super('openapi/query-serializer', 'openapi/query-type', 'query')
  }
}

export class PathParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/path-serializer'> {
  constructor() {
    super('openapi/path-serializer', 'openapi/path-type', 'path')
  }
}

export class RequestHeaderParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/request-headers-serializer'> {
  constructor() {
    super('openapi/request-headers-serializer', 'openapi/request-headers-type', 'header')
  }
}

export function queryParameterSerializers(): OpenAPIGenerator {
  return new QueryParameterSerializersGenerator()
}

export function pathParameterSerializers(): OpenAPIGenerator {
  return new PathParameterSerializersGenerator()
}

export function requestHeaderParameterSerializers(): OpenAPIGenerator {
  return new RequestHeaderParameterSerializersGenerator()
}

export function responseHeaderParameterSerializers(): OpenAPIGenerator {
  return new ResponseHeadersParameterSerializersGenerator()
}
