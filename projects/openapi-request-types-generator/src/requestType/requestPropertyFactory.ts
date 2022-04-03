import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, PropertySignature, SyntaxKind, TypeNode } from 'typescript'
import { RequestPropertyName } from '../common/types'

export function requestPropertyFactory(
  name: RequestPropertyName,
  type: TypeNode,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): PropertySignature {
  const { dereference } = context
  switch (name) {
    case 'body': {
      const body = dereference(data.operation.requestBody)
      return factory.createPropertySignature(
        [],
        name,
        body?.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
        type,
      )
    }
    default: {
      return factory.createPropertySignature([], name, undefined, type)
    }
  }
}
