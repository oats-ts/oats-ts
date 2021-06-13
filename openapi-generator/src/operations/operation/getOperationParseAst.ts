import { callExpression, Expression, identifier, memberExpression } from '@babel/types'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getOperationRequestAst } from './getOperationRequestAst'

export function getOperationParseAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Expression {
  const { operation } = data
  return callExpression(memberExpression(identifier('config'), identifier('parse')), [
    getOperationRequestAst(data, context),
    identifier(context.accessor.name(operation, 'operation-response-parser-hint')),
  ])
}
