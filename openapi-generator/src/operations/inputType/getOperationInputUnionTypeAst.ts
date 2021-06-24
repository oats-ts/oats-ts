import { entries } from 'lodash'
import { factory, TypeAliasDeclaration } from 'typescript'
import { tsExportModifier } from '../../common/typeScriptUtils'
import { getTypeReferenceAst } from '../../types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
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
      getTypeReferenceAst(mediaType.schema, context, { enums: false, documentation: false }),
    ])
  })
  return factory.createTypeAliasDeclaration(
    [],
    [tsExportModifier()],
    typeName,
    undefined,
    factory.createUnionTypeNode(types),
  )
}
