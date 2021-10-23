import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { GeneratorConfig } from '@oats-ts/generator'
import { ParameterTypesGeneratorConfig } from './typings'
import { InputParameterTypesGenerator } from './InputParameterTypesGenerator'
import { ResponseHeaderTypesGenerator } from './ResponseHeaderTypesGenerator'

export type { ParameterTypesGeneratorConfig } from './typings'

export class QueryParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    super('openapi/query-parameter-types', 'openapi/query-type', 'query', config)
  }
}

export class PathParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    super('openapi/path-parameter-types', 'openapi/path-type', 'path', config)
  }
}

export class RequestHeaderParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    super('openapi/request-header-parameter-types', 'openapi/request-headers-type', 'header', config)
  }
}

export function queryParameterTypes(config: GeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new QueryParameterTypesGenerator(config)
}

export function pathParameterTypes(config: GeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new PathParameterTypesGenerator(config)
}

export function requestHeaderParameterTypes(config: GeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new RequestHeaderParameterTypesGenerator(config)
}

export function responseHeaderParameterTypes(
  config: GeneratorConfig & ParameterTypesGeneratorConfig,
): OpenAPIGenerator {
  return new ResponseHeaderTypesGenerator(config)
}
