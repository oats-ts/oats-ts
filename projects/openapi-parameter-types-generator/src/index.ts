import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig } from './typings'
import { InputParameterTypesGenerator } from './InputParameterTypesGenerator'
import { ResponseHeaderTypesGenerator } from './response/ResponseHeaderTypesGenerator'

export type { ParameterTypesGeneratorConfig } from './typings'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export class QueryParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/query-type'> {
  constructor(config: Partial<ParameterTypesGeneratorConfig> = {}) {
    super('openapi/query-type', 'query', defaultConfig(config))
  }
}

export class PathParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/path-type'> {
  constructor(config: Partial<ParameterTypesGeneratorConfig> = {}) {
    super('openapi/path-type', 'path', defaultConfig(config))
  }
}

export class RequestHeaderParameterTypesGenerator extends InputParameterTypesGenerator<'openapi/request-headers-type'> {
  constructor(config: Partial<ParameterTypesGeneratorConfig> = {}) {
    super('openapi/request-headers-type', 'header', defaultConfig(config))
  }
}

export function queryParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new QueryParameterTypesGenerator(defaultConfig(config))
}

export function pathParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new PathParameterTypesGenerator(defaultConfig(config))
}

export function requestHeaderParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new RequestHeaderParameterTypesGenerator(defaultConfig(config))
}

export function responseHeaderParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): OpenAPIGenerator {
  return new ResponseHeaderTypesGenerator(defaultConfig(config))
}
