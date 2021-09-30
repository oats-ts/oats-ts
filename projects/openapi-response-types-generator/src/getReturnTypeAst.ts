import { head, isNil } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeReferenceNode } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getEnhancedResponses } from '@oats-ts/openapi-common'

function createDefaultStatusCodeType(knownStatusCodes: string[]): TypeReferenceNode {
  const statusCodeTypeRef = factory.createTypeReferenceNode(RuntimePackages.Http.StatusCode)

  const knownStatusCodesType = factory.createUnionTypeNode(
    knownStatusCodes.map((status) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
  )
  return knownStatusCodes.length > 0
    ? factory.createTypeReferenceNode('Exclude', [statusCodeTypeRef, knownStatusCodesType])
    : statusCodeTypeRef
}

export function getReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
  const { referenceOf } = context
  const responses = getEnhancedResponses(data.operation, context)
  const types: TypeReferenceNode[] = []
  if (responses.length === 0) {
    types.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HttpResponse, [
        factory.createTypeReferenceNode('undefined'),
      ]),
    )
  } else {
    const knownStatusCodes = responses.map(({ statusCode }) => statusCode).filter((s) => s !== 'default')
    const responseTypes = responses.map(({ mediaType, schema, statusCode }) => {
      const bodyType = referenceOf<TypeReferenceNode>(schema, 'openapi/type')
      const statusCodeType =
        statusCode === 'default'
          ? createDefaultStatusCodeType(knownStatusCodes)
          : factory.createLiteralTypeNode(factory.createNumericLiteral(statusCode))
      const mediaTypeType = factory.createLiteralTypeNode(factory.createStringLiteral(mediaType))
      const headersType = factory.createTypeReferenceNode('Record', [
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
      ])

      return factory.createTypeReferenceNode(RuntimePackages.Http.HttpResponse, [
        bodyType,
        statusCodeType,
        mediaTypeType,
        headersType,
      ])
    })

    types.push(...responseTypes)
  }

  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    referenceOf(data.operation, 'openapi/response-type'),
    undefined,
    types.length === 1 ? head(types) : factory.createUnionTypeNode(types),
  )
}
