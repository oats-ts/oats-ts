import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, VariableStatement, SyntaxKind, NodeFlags } from 'typescript'
import { ExpressRouteGeneratorConfig } from '.'
import { getPathTemplate } from './getPathTemplate'
import { getExpressRouteHandlerAst } from './getExpressRouteHandlerAst'

export function getExpressRouteAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
): VariableStatement {
  const { nameOf } = context
  const { operation, url } = data

  const routeAst = factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
      data.method.toLowerCase(),
    ),
    [],
    [factory.createStringLiteral(getPathTemplate(url)), getExpressRouteHandlerAst(data, context, config)],
  )

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(operation, 'openapi/express-route'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Express.Router),
          routeAst,
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
