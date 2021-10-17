import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'

export function getConfigurationStatementAst(configurationKey: string) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('configuration'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.HttpServer.ServerConfiguration, [
            factory.createTypeReferenceNode(RuntimePackages.Express.Request),
            factory.createTypeReferenceNode(RuntimePackages.Express.Response),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('response'),
              factory.createIdentifier('locals'),
            ),
            factory.createStringLiteral(configurationKey),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
