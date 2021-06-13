import { ParameterLocation } from 'openapi3-ts'

export function getParameterSerializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return 'createHeaderSerializer'
    case 'path':
      return 'createPathSerializer'
    case 'query':
      return 'createQuerySerializer'
    default:
      return undefined
  }
}
