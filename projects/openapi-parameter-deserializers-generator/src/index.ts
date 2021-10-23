import { ParameterDeserializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterDeserializersGenerator } from './InputParameterDeserializersGenerator'

export type { ParameterDeserializersGeneratorConfig } from './typings'

export class QueryParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super('openapi/query-parameter-deserializers', 'openapi/query-type', 'openapi/query-deserializer', 'query', config)
  }
}

export class PathParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super('openapi/path-parameter-deserializers', 'openapi/path-type', 'openapi/path-deserializer', 'path', config)
  }
}

export class RequestHeaderParameterDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    super(
      'openapi/request-header-parameter-deserializers',
      'openapi/request-headers-type',
      'openapi/request-headers-deserializer',
      'header',
      config,
    )
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
