import { CallExpression, callExpression, Expression, identifier, memberExpression, stringLiteral } from '@babel/types'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getParameterSerializerCallAst } from './getParameterSerializerCallAst'

export function getUrlAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): CallExpression {
  const { accessor } = context
  const { path, query, url, operation } = data

  const parameterAsts: Expression[] = [memberExpression(identifier('config'), identifier('baseUrl'))]

  if (path.length === 0) {
    // If no path parameter, no serialization needed, use url as is
    parameterAsts.push(stringLiteral(url))
  } else {
    // Otherwise use serializer
    parameterAsts.push(getParameterSerializerCallAst(accessor.name(operation, 'operation-path-serializer'), 'path'))
  }

  if (query.length > 0) {
    parameterAsts.push(getParameterSerializerCallAst(accessor.name(operation, 'operation-query-serializer'), 'query'))
  }

  return callExpression(identifier('joinUrl'), parameterAsts)
}
