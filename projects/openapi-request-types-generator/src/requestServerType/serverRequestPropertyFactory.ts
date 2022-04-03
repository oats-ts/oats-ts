import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, PropertySignature, TypeNode } from 'typescript'
import { RequestPropertyName } from '../common/types'

export function serverRequestPropertyFactory(
  name: RequestPropertyName,
  type: TypeNode,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): PropertySignature {
  const { dereference } = context
  switch (name) {
    case 'body': {
      const body = dereference(data.operation.requestBody)
      const wrappedType = body?.required
        ? type
        : factory.createUnionTypeNode([type, factory.createTypeReferenceNode('undefined')])
      const tryType = factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [wrappedType])
      return factory.createPropertySignature([], name, undefined, tryType)
    }
    default: {
      const tryType = factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [type])
      return factory.createPropertySignature([], name, undefined, tryType)
    }
  }
}
