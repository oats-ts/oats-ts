import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  classDeclaration,
  classBody,
  classImplements,
  classMethod,
  tsTypeReference,
  blockStatement,
  tsTypeAnnotation,
  throwStatement,
  newExpression,
  stringLiteral,
} from '@babel/types'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiStubMethodAst } from './getApiStubMethodAst'

export function getApiStubAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  implement: boolean,
): ExportNamedDeclaration {
  const { accessor } = context

  const fallbackMethod = classMethod(
    'method',
    identifier('fallback'),
    [],
    blockStatement([throwStatement(newExpression(identifier('Error'), [stringLiteral('Not implemented.')]))]),
  )
  fallbackMethod.accessibility = 'protected'
  fallbackMethod.returnType = tsTypeAnnotation(tsTypeReference(identifier('never')))

  const classDecl = classDeclaration(
    identifier(accessor.name(document, 'api-stub')),
    undefined,
    classBody([fallbackMethod, ...operations.map((operation) => getApiStubMethodAst(operation, context))]),
    undefined,
  )

  classDecl.implements = implement ? [classImplements(identifier(accessor.name(document, 'api-type')))] : undefined

  return exportNamedDeclaration(classDecl)
}
