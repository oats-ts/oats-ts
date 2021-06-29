import { entries } from 'lodash'
import { AwaitExpression, factory, PropertyAssignment, SpreadAssignment } from 'typescript'
import { OpenAPIGeneratorContext, getRequestBodyContent } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getParameterSerializerCallAst } from './getParameterSerializerCallAst'
import { getUrlAst } from './getUrlAst'

function getHeadersParameter(data: EnhancedOperation, context: OpenAPIGeneratorContext): PropertyAssignment {
  const { accessor } = context
  const { header } = data
  const bodies = entries(getRequestBodyContent(data, context))
  const headerSerializerAst = getParameterSerializerCallAst(
    accessor.name(data.operation, 'operation-headers-serializer'),
    'headers',
  )
  if (header.length > 0 && bodies.length === 0) {
    return factory.createPropertyAssignment('headers', headerSerializerAst)
  }
  if (bodies.length > 0) {
    const properties: (PropertyAssignment | SpreadAssignment)[] = []
    if (header.length > 0) {
      properties.push(factory.createSpreadAssignment(headerSerializerAst))
    }
    properties.push(
      factory.createPropertyAssignment(
        factory.createStringLiteral('content-type'),
        factory.createPropertyAccessExpression(factory.createIdentifier('input'), 'contentType'),
      ),
    )
    return factory.createPropertyAssignment(
      factory.createIdentifier('headers'),
      factory.createObjectLiteralExpression(properties),
    )
  }
  return undefined
}

export function getOperationRequestAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): AwaitExpression {
  const { method, header } = data
  const bodies = entries(getRequestBodyContent(data, context))

  const properties: PropertyAssignment[] = [
    factory.createPropertyAssignment('url', getUrlAst(data, context)),
    factory.createPropertyAssignment('method', factory.createStringLiteral(method)),
  ]

  if (bodies.length > 0) {
    properties.push(
      factory.createPropertyAssignment(
        'body',
        factory.createAwaitExpression(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'serialize'),
            [],
            [
              factory.createPropertyAccessExpression(factory.createIdentifier('input'), 'contentType'),
              factory.createPropertyAccessExpression(factory.createIdentifier('input'), 'body'),
            ],
          ),
        ),
      ),
    )
  }

  if (bodies.length > 0 || header.length > 0) {
    properties.push(getHeadersParameter(data, context))
  }

  return factory.createAwaitExpression(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'request'),
      [],
      [factory.createObjectLiteralExpression(properties)],
    ),
  )
}
