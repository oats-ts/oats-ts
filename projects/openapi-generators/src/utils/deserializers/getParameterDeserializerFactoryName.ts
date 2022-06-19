import { ParameterLocation } from '@oats-ts/openapi-model'
import { RuntimePackages } from '@oats-ts/openapi-common'

export function getParameterDeserializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return RuntimePackages.ParameterSerialization.createHeaderDeserializer
    case 'path':
      return RuntimePackages.ParameterSerialization.createPathDeserializer
    case 'query':
      return RuntimePackages.ParameterSerialization.createQueryDeserializer
    default:
      return undefined
  }
}
