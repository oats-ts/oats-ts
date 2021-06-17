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
} from '@babel/types'
import { typedIdAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../../operations/inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../../operations/returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../../operations/typings'

export function getApiClassMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): ClassMethod {
  const { accessor } = context

  const parameters = isOperationInputTypeRequired(data, context)
    ? [typedIdAst('input', tsTypeReference(identifier(accessor.name(data.operation, 'operation-input-type'))))]
    : []
  const returnType = getOperationReturnTypeReferenceAst(data.operation, context)

  const returnStmnt = returnStatement(
    callExpression(identifier(accessor.name(data.operation, 'operation')), [
      memberExpression(identifier('this'), identifier('config')),
      identifier('input'),
    ]),
  )

  const method = classMethod(
    'method',
    identifier(accessor.name(data.operation, 'operation')),
    parameters,
    blockStatement([returnStmnt]),
  )

  method.async = true
  method.returnType = tsTypeAnnotation(
    tsTypeReference(identifier('Promise'), tsTypeParameterInstantiation([returnType])),
  )

  return method
}
