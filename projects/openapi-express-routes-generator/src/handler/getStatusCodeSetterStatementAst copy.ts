import { factory } from 'typescript'
import { Names } from './names'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getStatusCodeSetterStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  return factory.createExpressionStatement(
    factory.createAwaitExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(Names.configuration),
          factory.createIdentifier('setStatusCode'),
        ),
        undefined,
        [
          factory.createIdentifier(Names.response),
          factory.createPropertyAccessExpression(
            factory.createIdentifier(Names.handlerResult),
            factory.createIdentifier(Names.statusCode),
          ),
        ],
      ),
    ),
  )
}
