import { factory, NodeFlags } from 'typescript'
import { Names } from './names'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getResponseHeadersStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.responseHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getResponseHeaders'),
              ),
              undefined,
              [
                factory.createPropertyAccessExpression(factory.createIdentifier(Names.handlerResult), Names.headers),
                factory.createIdentifier('undefined'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
