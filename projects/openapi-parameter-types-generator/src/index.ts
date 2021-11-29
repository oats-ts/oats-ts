import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { GeneratorConfig } from '@oats-ts/generator'
import { ParameterTypesGeneratorConfig } from './typings'
import { InputParameterTypesGenerator } from './InputParameterTypesGenerator'
import { ResponseHeaderTypesGenerator } from './response/ResponseHeaderTypesGenerator'

export type { ParameterTypesGeneratorConfig } from './typings'

export class QueryParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/query-type'> {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/query-type', 'query', config)
  }
}

export class PathParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/path-type'> {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/path-type', 'path', config)
  }
}

export class RequestHeaderParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/request-headers-type'> {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/request-headers-type', 'header', config)
  }
}

export function queryParameterTypes(config: ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new QueryParameterTypesGenerator(config)
}

export function pathParameterTypes(config: ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new PathParameterTypesGenerator(config)
}

export function requestHeaderParameterTypes(config: ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new RequestHeaderParameterTypesGenerator(config)
}

export function responseHeaderParameterTypes(config: ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new ResponseHeaderTypesGenerator(config)
}
