import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

export function getParameterTypeGeneratorTarget(location: ParameterLocation): OpenAPIGeneratorTarget {
  switch (location) {
    case 'header':
      return 'operation-headers-type'
    case 'path':
      return 'operation-path-type'
    case 'query':
      return 'operation-query-type'
  }
}
