import {
  exportNamedDeclaration,
  ExportNamedDeclaration,
  identifier,
  stringLiteral,
  tsLiteralType,
  tsTypeAliasDeclaration,
  tsTypeParameterInstantiation,
  tsTypeReference,
  tsUnionType,
} from '@babel/types'
import { entries } from 'lodash'
import { getTypeReferenceAst } from '../../schemas/types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getRequestBodyContent } from './getRequestBodyContent'

export function getOperationInputUnionTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context
  const bodies = entries(getRequestBodyContent(data, context))
  const typeName = accessor.name(data.operation, 'operation-input-type')
  const baseTypeName = `_${typeName}`
  const types = bodies.map(([contentType, mediaType]) => {
    return tsTypeReference(
      identifier(baseTypeName),
      tsTypeParameterInstantiation([
        tsLiteralType(stringLiteral(contentType)),
        getTypeReferenceAst(mediaType.schema, context),
      ]),
    )
  })
  return exportNamedDeclaration(tsTypeAliasDeclaration(identifier(typeName), undefined, tsUnionType(types)))
}
