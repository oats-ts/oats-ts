import { entries, head, isNil } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeReferenceNode } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getResponseSchemas } from '@oats-ts/openapi-common'

export function getReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
  const { referenceOf } = context
  const responses = entries(getResponseSchemas(data.operation, context))
  const types: TypeReferenceNode[] = []
  if (responses.length === 0) {
    types.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HttpResponse, [factory.createTypeReferenceNode('void')]),
    )
  }

  const defaultResponse = responses.find(([status]) => status === 'default')
  const statusCodeResponses = responses.filter(([status]) => status !== 'default')
  types.push(
    ...statusCodeResponses.map(([status, schema]) =>
      factory.createTypeReferenceNode(RuntimePackages.Http.HttpResponse, [
        referenceOf(schema, 'openapi/type'),
        factory.createLiteralTypeNode(factory.createNumericLiteral(status)),
      ]),
    ),
  )
  if (!isNil(defaultResponse)) {
    const knownStatusCodesType = factory.createUnionTypeNode(
      statusCodeResponses.map(([status]) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
    )
    const statusCodeTypeRef = factory.createTypeReferenceNode(RuntimePackages.Http.StatusCode)

    const statusCodeType =
      statusCodeResponses.length > 0
        ? factory.createTypeReferenceNode('Exclude', [statusCodeTypeRef, knownStatusCodesType])
        : statusCodeTypeRef

    const [, schema] = defaultResponse
    const type = factory.createTypeReferenceNode(RuntimePackages.Http.HttpResponse, [
      referenceOf(schema, 'openapi/type'),
      statusCodeType,
    ])

    types.push(type)
  }
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    referenceOf(data.operation, 'openapi/response-type'),
    undefined,
    types.length === 1 ? head(types) : factory.createUnionTypeNode(types),
  )
}
