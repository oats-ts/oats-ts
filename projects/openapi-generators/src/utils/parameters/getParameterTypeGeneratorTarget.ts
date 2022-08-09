import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export function getParameterTypeGeneratorTarget(location: ParameterLocation): OpenAPIGeneratorTarget {
  switch (location) {
    case 'header':
      return 'oats/request-headers-type'
    case 'path':
      return 'oats/path-type'
    case 'query':
      return 'oats/query-type'
    case 'cookie':
      throw new TypeError(`cookie parameters are not supported`)
  }
}
