import { factory, ParameterDeclaration, TypeReferenceNode } from 'typescript'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'

export function getSdkMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ParameterDeclaration[] {
  const requestType = context.referenceOf<TypeReferenceNode>(data.operation, 'oats/request-type')
  return isNil(requestType)
    ? []
    : [factory.createParameterDeclaration([], [], undefined, 'request', undefined, requestType)]
}
