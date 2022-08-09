import { head, isNil, keys } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeLiteralNode, TypeNode, TypeReferenceNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getEnhancedResponses } from '@oats-ts/openapi-common'

function createDefaultStatusCodeType(knownStatusCodes: string[]): TypeReferenceNode {
  const statusCodeTypeRef = factory.createTypeReferenceNode('number')

  const knownStatusCodesType = factory.createUnionTypeNode(
    knownStatusCodes.map((status) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
  )
  return knownStatusCodes.length > 0
    ? factory.createTypeReferenceNode('Exclude', [statusCodeTypeRef, knownStatusCodesType])
    : statusCodeTypeRef
}

function createResponseTypeLiteral(
  mimeType: TypeNode,
  statusType: TypeNode,
  bodyType: TypeNode,
  headersType?: TypeNode,
): TypeLiteralNode {
  return factory.createTypeLiteralNode([
    factory.createPropertySignature(undefined, 'mimeType', undefined, mimeType),
    factory.createPropertySignature(undefined, 'statusCode', undefined, statusType),
    factory.createPropertySignature(undefined, 'body', undefined, bodyType),
    ...(isNil(headersType) ? [] : [factory.createPropertySignature(undefined, 'headers', undefined, headersType)]),
  ])
}

export function getReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
  const { referenceOf } = context
  const responses = getEnhancedResponses(data.operation, context)
  const types: TypeNode[] = []
  if (responses.length === 0) {
    types.push(
      createResponseTypeLiteral(
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
        factory.createTypeReferenceNode('unknown'),
        factory.createTypeReferenceNode('unknown'),
      ),
    )
  } else {
    const knownStatusCodes = responses.map(({ statusCode }) => statusCode).filter((s) => s !== 'default')
    const responseTypes = responses.map(({ mediaType, schema, statusCode, headers }) => {
      const hasResponseHeaders = keys(headers || {}).length > 0
      const bodyType = referenceOf<TypeNode>(schema, 'oats/type')
      const statusCodeType =
        statusCode === 'default'
          ? createDefaultStatusCodeType(knownStatusCodes)
          : factory.createLiteralTypeNode(factory.createNumericLiteral(statusCode))
      const mediaTypeType = factory.createLiteralTypeNode(factory.createStringLiteral(mediaType))
      const headersType = hasResponseHeaders
        ? factory.createTypeReferenceNode(context.nameOf([data.operation, statusCode], 'oats/response-headers-type'))
        : undefined

      return createResponseTypeLiteral(mediaTypeType, statusCodeType, bodyType, headersType)
    })

    types.push(...responseTypes)
  }

  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(context.nameOf(data.operation, 'oats/response-type')),
    undefined,
    types.length === 1 ? head(types)! : factory.createUnionTypeNode(types),
  )
}
