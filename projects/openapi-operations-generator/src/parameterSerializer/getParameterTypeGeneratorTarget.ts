import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

/* TODO this is duplicated for the moment in both this and parameter-types generator. */
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
