import { factory, ParameterDeclaration } from 'typescript'
import { hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getSdkMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  unused: boolean,
): ParameterDeclaration[] {
  const { nameOf } = context

  return hasInput(data, context)
    ? [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          unused ? '_request' : 'request',
          undefined,
          factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/request-type')),
        ),
      ]
    : []
}
