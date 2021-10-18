import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'
import { Names } from './names'

export function getApiStatementAst(apiTypeName: string, apiImplKey: string) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.api),
          undefined,
          factory.createTypeReferenceNode(apiTypeName, [
            factory.createTypeReferenceNode(RuntimePackages.HttpServerExpress.ExpressParameters),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(Names.response),
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
