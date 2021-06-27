import { CallExpression, Expression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getParameterSerializerCallAst } from './getParameterSerializerCallAst'

export function getUrlAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): CallExpression {
  const { accessor } = context
  const { path, query, url, operation } = data

  const parameterAsts: Expression[] = [
    factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'baseUrl'),
  ]

  if (path.length === 0) {
    // If no path parameter, no serialization needed, use url as is
    parameterAsts.push(factory.createStringLiteral(url))
  } else {
    // Otherwise use serializer
    parameterAsts.push(getParameterSerializerCallAst(accessor.name(operation, 'operation-path-serializer'), 'path'))
  }

  if (query.length > 0) {
    parameterAsts.push(getParameterSerializerCallAst(accessor.name(operation, 'operation-query-serializer'), 'query'))
  }

  return factory.createCallExpression(factory.createIdentifier('joinUrl'), [], parameterAsts)
}
