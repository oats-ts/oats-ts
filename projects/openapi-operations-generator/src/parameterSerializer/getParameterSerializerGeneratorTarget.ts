import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

export function getParameterSerializerGeneratorTarget(location: ParameterLocation): OpenAPIGeneratorTarget {
  switch (location) {
    case 'header':
      return 'operation-headers-serializer'
    case 'path':
      return 'operation-path-serializer'
    case 'query':
      return 'operation-query-serializer'
    default:
      return undefined
  }
}
