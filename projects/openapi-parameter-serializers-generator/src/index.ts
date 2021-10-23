import { ParameterSerializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { InputParameterSerializerGenerator } from './InputParameterSerializerGenerator'

export type { ParameterSerializersGeneratorConfig } from './typings'

export class QueryParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/query-serializer'> {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super('openapi/query-serializer', 'openapi/query-type', 'query', config)
  }
}

export class PathParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/path-serializer'> {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super('openapi/path-serializer', 'openapi/path-type', 'path', config)
  }
}

export class RequestHeaderParameterSerializersGenerator extends InputParameterSerializerGenerator<'openapi/request-headers-serializer'> {
  constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    super('openapi/request-headers-serializer', 'openapi/request-headers-type', 'header', config)
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
