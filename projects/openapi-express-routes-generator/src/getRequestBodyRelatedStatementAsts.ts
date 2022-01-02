import {
  EnhancedOperation,
  getRequestBodyContent,
  hasRequestBody,
  OpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { isNil, keys, uniqWith, values, isEqual } from 'lodash'
import { factory, NodeFlags, TypeNode, VariableStatement } from 'typescript'
import { Names } from './Names'

export function getBodyTypesUnionType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeNode {
  const { referenceOf } = context
  const bodyTypes = uniqWith(
    values(getRequestBodyContent(data, context))
      .map((mediaType) => mediaType.schema)
      .filter((schema) => !isNil(schema))
      .map((schema) => referenceOf(schema, 'openapi/type')),
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
  const { referenceOf } = context
  const mediaTypeUnion = getMimeTypesUnionType(data, context)
  const bodiesUnion = getBodyTypesUnionType(data, context)
  const mimeType = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.mimeType),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getMimeType'),
              ),
              [mediaTypeUnion],
              [factory.createIdentifier(Names.frameworkInput)],
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
          factory.createIdentifier(Names.body),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getRequestBody'),
              ),
              [mediaTypeUnion, bodiesUnion],
              [
                factory.createIdentifier(Names.frameworkInput),
                factory.createIdentifier(Names.mimeType),
                referenceOf(data.operation, 'openapi/request-body-validator'),
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
