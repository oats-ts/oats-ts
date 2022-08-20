import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, VariableStatement, SyntaxKind, NodeFlags } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getPathTemplate } from './getPathTemplate'
import { getExpressRouterHandlerAst } from './getExpressRouterHandlerAst'

export function getExpressRouterAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): VariableStatement {
  const { nameOf } = context
  const { operation, url } = data

  const routeAst = factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
      data.method.toLowerCase(),
    ),
    [],
    [factory.createStringLiteral(getPathTemplate(url)), getExpressRouterHandlerAst(data, context, config)],
  )

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(operation, 'oats/express-router'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Express.Router),
          routeAst,
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
