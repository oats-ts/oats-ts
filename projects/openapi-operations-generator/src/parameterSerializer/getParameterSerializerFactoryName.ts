import { ParameterLocation } from 'openapi3-ts'
import { RuntimePackages } from '@oats-ts/openapi-common'

export function getParameterSerializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return RuntimePackages.ParameterSerialization.createHeaderSerializer
    case 'path':
      return RuntimePackages.ParameterSerialization.createPathSerializer
    case 'query':
      return RuntimePackages.ParameterSerialization.createQuerySerializer
    default:
      return undefined
  }
}
