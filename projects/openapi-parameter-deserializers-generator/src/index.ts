import { ParameterDeserializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterDeserializersGenerator } from './InputParameterDeserializersGenerator'
import { ResponseHeadersParameterDeserializersGenerator } from './responseHeaders/ResponseHeadersParameterSerializersGenerator'

export type { ParameterDeserializersGeneratorConfig } from './typings'

export class QueryParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/query-deserializer'> {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super('openapi/query-deserializer', 'openapi/query-type', 'query', config)
  }
}

export class PathParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/path-deserializer'> {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super('openapi/path-deserializer', 'openapi/path-type', 'path', config)
  }
}

export class RequestHeaderParameterDeserializersGenerator extends InputParameterDeserializersGenerator<'openapi/request-headers-deserializer'> {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super('openapi/request-headers-deserializer', 'openapi/request-headers-type', 'header', config)
  }
}

export function queryParameterDeserializers(
  config: GeneratorConfig & ParameterDeserializersGeneratorConfig,
): OpenAPIGenerator {
  return new QueryParameterDeserializersGenerator(config)
}

export function pathParameterDeserializers(
  config: GeneratorConfig & ParameterDeserializersGeneratorConfig,
): OpenAPIGenerator {
  return new PathParameterDeserializersGenerator(config)
}

export function requestHeaderParameterDeserializers(
  config: GeneratorConfig & ParameterDeserializersGeneratorConfig,
): OpenAPIGenerator {
  return new RequestHeaderParameterDeserializersGenerator(config)
}

export function responseHeaderParameterDeserializers(config: GeneratorConfig): OpenAPIGenerator {
  return new ResponseHeadersParameterDeserializersGenerator(config)
}
