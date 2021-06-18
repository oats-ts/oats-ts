import {
  identifier,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
  ClassMethod,
  classMethod,
  blockStatement,
  returnStatement,
  callExpression,
  memberExpression,
  objectExpression,
  spreadElement,
} from '@babel/types'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiMethodParameterAsts } from './getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from './getApiMethodReturnTypeAst'

export function getApiClassMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): ClassMethod {
  const { accessor } = context

  const returnStmnt = returnStatement(
    callExpression(identifier(accessor.name(data.operation, 'operation')), [
      identifier('input'),
      objectExpression([
        spreadElement(memberExpression(identifier('this'), identifier('config'))),
        spreadElement(identifier('config')),
      ]),
    ]),
  )

  const method = classMethod(
    'method',
    identifier(accessor.name(data.operation, 'operation')),
    getApiMethodParameterAsts(data, context),
    blockStatement([returnStmnt]),
  )

  method.async = true
  method.returnType = getApiMethodReturnTypeAst(data, context)
  method.accessibility = 'public'

  return method
}
