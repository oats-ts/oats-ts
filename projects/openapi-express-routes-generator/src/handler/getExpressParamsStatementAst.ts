import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'
import { Names } from './names'

export function getExpressParamsStatementAst() {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.expressParams),
          undefined,
          factory.createTypeReferenceNode(
            factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressParameters),
            undefined,
          ),
          factory.createObjectLiteralExpression([
            factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.request), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.response), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.next), undefined),
          ]),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
