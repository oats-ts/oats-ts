import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  tsTypeAliasDeclaration,
  tsTypeLiteral,
} from '@babel/types'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getRequestTypeMethodSignatureAst } from './getRequestTypeMethodSignatureAst'

export function getRequestsTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context
  return exportNamedDeclaration(
    tsTypeAliasDeclaration(
      identifier(accessor.name(document, 'requests-type')),
      undefined,
      tsTypeLiteral(operations.map((operation) => getRequestTypeMethodSignatureAst(operation, context))),
    ),
  )
}
