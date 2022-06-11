import { ParameterLocation } from '@oats-ts/openapi-model'
import { RuntimePackages } from '@oats-ts/openapi-common'

export function getParameterDeserializerFactoryName(location: ParameterLocation) {
  switch (location) {
    case 'header':
      return RuntimePackages.ParameterDeserialization.createHeaderDeserializer
    case 'path':
      return RuntimePackages.ParameterDeserialization.createPathDeserializer
    case 'query':
      return RuntimePackages.ParameterDeserialization.createQueryDeserializer
    default:
      return undefined
  }
}
