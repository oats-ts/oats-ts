import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'

export function getApiStatementAst(apiTypeName: string, apiImplKey: string) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('api'),
          undefined,
          factory.createTypeReferenceNode(apiTypeName, [
            factory.createTypeReferenceNode(RuntimePackages.HttpServerExpress.ExpressParameters),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('response'),
              factory.createIdentifier('locals'),
            ),
            factory.createStringLiteral(apiImplKey),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
