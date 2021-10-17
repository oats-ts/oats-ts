import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'

export function getExpressParamsStatementAst() {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('expressParameters'),
          undefined,
          factory.createTypeReferenceNode(
            factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressParameters),
            undefined,
          ),
          factory.createObjectLiteralExpression([
            factory.createShorthandPropertyAssignment(factory.createIdentifier('request'), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier('response'), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier('next'), undefined),
          ]),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
