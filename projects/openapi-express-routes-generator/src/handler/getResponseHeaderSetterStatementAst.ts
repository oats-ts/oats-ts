import { factory } from 'typescript'
import { Names } from './names'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getResponseHeaderSetterStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  return factory.createExpressionStatement(
    factory.createAwaitExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(Names.configuration),
          factory.createIdentifier('setResponseHeaders'),
        ),
        undefined,
        [factory.createIdentifier(Names.response), factory.createIdentifier(Names.responseHeaders)],
      ),
    ),
  )
}
