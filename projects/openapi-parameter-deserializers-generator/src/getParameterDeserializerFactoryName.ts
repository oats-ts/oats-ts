import { ParameterLocation } from '@oats-ts/openapi-model'
import { RuntimePackages } from '@oats-ts/openapi-common'

export function getParameterDeserializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return RuntimePackages.ParameterDeserialization.createHeaderParser
    case 'path':
      return RuntimePackages.ParameterDeserialization.createPathParser
    case 'query':
      return RuntimePackages.ParameterDeserialization.createQueryParser
    default:
      return undefined
  }
}
