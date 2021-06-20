import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'
import { factory, TypeAliasDeclaration } from 'typescript'
import { tsExportModifier } from '../../common/typeScriptUtils'

export function getApiTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration {
  const { accessor } = context
  return factory.createTypeAliasDeclaration(
    [],
    [tsExportModifier()],
    accessor.name(document, 'api-type'),
    [],
    factory.createTypeLiteralNode(operations.map((operation) => getApiTypeMethodSignatureAst(operation, context))),
  )
}
