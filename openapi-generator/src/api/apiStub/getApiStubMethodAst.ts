import {
  identifier,
  ClassMethod,
  classMethod,
  blockStatement,
  returnStatement,
  callExpression,
  memberExpression,
} from '@babel/types'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiMethodParameterAsts } from '../apiClass/getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'

export function getApiStubMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): ClassMethod {
  const { accessor } = context

  const returnStmnt = returnStatement(callExpression(memberExpression(identifier('this'), identifier('fallback')), []))

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
