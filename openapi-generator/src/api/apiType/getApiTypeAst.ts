import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  tsTypeAliasDeclaration,
  tsTypeLiteral,
} from '@babel/types'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'

export function getApiTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context
  return exportNamedDeclaration(
    tsTypeAliasDeclaration(
      identifier(accessor.name(document, 'api-type')),
      undefined,
      tsTypeLiteral(operations.map((operation) => getApiTypeMethodSignatureAst(operation, context))),
    ),
  )
}
