import { entries } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { EnhancedOperation, getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getOperationInputUnionTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration {
  const { nameOf, referenceOf } = context
  const bodies = entries(getRequestBodyContent(data, context))
  const typeName = nameOf(data.operation, 'openapi/request-type')
  const baseTypeName = `_${typeName}`
  const types = bodies.map(([contentType, mediaType]) => {
    return factory.createTypeReferenceNode(baseTypeName, [
      factory.createLiteralTypeNode(factory.createStringLiteral(contentType)),
      referenceOf(mediaType.schema, 'openapi/type'),
    ])
  })
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    typeName,
    undefined,
    factory.createUnionTypeNode(types),
  )
}
