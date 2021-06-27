import { entries } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getRequestBodyContent } from './getRequestBodyContent'

export function getOperationInputUnionTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration {
  const { accessor } = context
  const bodies = entries(getRequestBodyContent(data, context))
  const typeName = accessor.name(data.operation, 'operation-input-type')
  const baseTypeName = `_${typeName}`
  const types = bodies.map(([contentType, mediaType]) => {
    return factory.createTypeReferenceNode(baseTypeName, [
      factory.createLiteralTypeNode(factory.createStringLiteral(contentType)),
      accessor.reference(mediaType.schema, 'type'),
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
