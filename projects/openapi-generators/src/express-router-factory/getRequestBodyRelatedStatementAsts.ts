import {
  EnhancedOperation,
  getRequestBodyContent,
  hasRequestBody,
  OpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { isNil, keys, uniqWith, values, isEqual } from 'lodash'
import { factory, NodeFlags, TypeNode, VariableStatement } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

export function getBodyTypesUnionType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeNode {
  const { referenceOf } = context
  const bodyTypes = uniqWith(
    values(getRequestBodyContent(data, context))
      .map((mediaType) => mediaType.schema)
      .filter((schema) => !isNil(schema))
      .map((schema) => referenceOf<TypeNode>(schema, 'oats/type')),
    isEqual,
  )
  switch (bodyTypes.length) {
    case 0:
      return factory.createTypeReferenceNode('any')
    case 1:
      return bodyTypes[0]
    default:
      return factory.createUnionTypeNode(bodyTypes)
  }
}

export function getMimeTypesUnionType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeNode {
  const mediaTypes = Array.from(new Set(keys(getRequestBodyContent(data, context)))).map(
    (mediaType): TypeNode => factory.createLiteralTypeNode(factory.createStringLiteral(mediaType)),
  )
  switch (mediaTypes.length) {
    case 0:
      return factory.createTypeReferenceNode('any')
    case 1:
      return mediaTypes[0]
    default:
      return factory.createUnionTypeNode(mediaTypes)
  }
}

export function getRequestBodyRelatedStatementAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): VariableStatement[] {
  if (!hasRequestBody(data, context)) {
    return []
  }
  const { referenceOf, dereference } = context
  const reqBody = dereference(data.operation.requestBody, true)
  const mediaTypeUnion = getMimeTypesUnionType(data, context)
  const bodiesUnion = getBodyTypesUnionType(data, context)
  const mimeType = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.mimeType),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.adapter),
                factory.createIdentifier('getMimeType'),
              ),
              [mediaTypeUnion],
              [factory.createIdentifier(RouterNames.toolkit)],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const body = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.body),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.adapter),
                factory.createIdentifier('getRequestBody'),
              ),
              [mediaTypeUnion, bodiesUnion],
              [
                factory.createIdentifier(RouterNames.toolkit),
                reqBody?.required ? factory.createTrue() : factory.createFalse(),
                factory.createIdentifier(RouterNames.mimeType),
                referenceOf(data.operation, 'oats/request-body-validator'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  return [mimeType, body]
}
