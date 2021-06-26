import { ParameterLocation } from 'openapi3-ts'
import { Params } from '../../common/OatsPackages'

export function getParameterSerializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return Params.createHeaderSerializer
    case 'path':
      return Params.createPathSerializer
    case 'query':
      return Params.createQuerySerializer
    default:
      return undefined
  }
}
