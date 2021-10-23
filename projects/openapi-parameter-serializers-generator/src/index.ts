import { ParameterSerializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterSerializerGenerator } from './InputParameterSerializerGenerator'

export type { ParameterSerializersGeneratorConfig } from './typings'

export class QueryParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super('openapi/query-parameter-serializers', 'openapi/query-type', 'openapi/query-serializer', 'query', config)
  }
}

export class PathParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super('openapi/path-parameter-serializers', 'openapi/path-type', 'openapi/path-serializer', 'path', config)
  }
}

export class RequestHeaderParameterSerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super(
      'openapi/request-header-parameter-serializers',
      'openapi/request-headers-type',
      'openapi/request-headers-serializer',
      'header',
      config,
    )
  }
}

export function queryParameterSerializers(
  config: GeneratorConfig & ParameterSerializersGeneratorConfig,
): OpenAPIGenerator {
  return new QueryParameterSerializersGenerator(config)
}

export function pathParameterSerializers(
  config: GeneratorConfig & ParameterSerializersGeneratorConfig,
): OpenAPIGenerator {
  return new PathParameterSerializersGenerator(config)
}

export function requestHeaderParameterSerializers(
  config: GeneratorConfig & ParameterSerializersGeneratorConfig,
): OpenAPIGenerator {
  return new RequestHeaderParameterSerializersGenerator(config)
}
