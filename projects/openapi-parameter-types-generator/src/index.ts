import { ParameterTypesGeneratorConfig } from './typings'
import { InputParameterTypesGenerator } from './InputParameterTypesGenerator'
import { ResponseHeaderTypesGenerator } from './response/ResponseHeaderTypesGenerator'

export type { ParameterTypesGeneratorConfig } from './typings'

function defaultConfig(config: Partial<ParameterTypesGeneratorConfig>): ParameterTypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export class QueryParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/query-type', 'query', config)
  }
}

export class PathParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/path-type', 'path', config)
  }
}

export class RequestHeaderParameterTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/request-headers-type', 'header', config)
  }
}

export function queryParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): QueryParameterTypesGenerator {
  return new QueryParameterTypesGenerator(defaultConfig(config))
}

export function pathParameterTypes(config: Partial<ParameterTypesGeneratorConfig> = {}): PathParameterTypesGenerator {
  return new PathParameterTypesGenerator(defaultConfig(config))
}

export function requestHeaderParameterTypes(
  config: Partial<ParameterTypesGeneratorConfig> = {},
): RequestHeaderParameterTypesGenerator {
  return new RequestHeaderParameterTypesGenerator(defaultConfig(config))
}

export function responseHeaderParameterTypes(
  config: Partial<ParameterTypesGeneratorConfig> = {},
): ResponseHeaderTypesGenerator {
  return new ResponseHeaderTypesGenerator(defaultConfig(config))
}
