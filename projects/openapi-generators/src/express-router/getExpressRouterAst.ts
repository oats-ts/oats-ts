import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, VariableStatement, SyntaxKind, NodeFlags } from 'typescript'
import { getExpressRouterExpressionAst } from './getExpressRouterExpressionAst'
import { ExpressRoutersGeneratorConfig } from './typings'

export function getExpressRouterAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): VariableStatement {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          context.nameOf(data.operation, 'oats/express-router'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Express.Router),
          getExpressRouterExpressionAst(data, context, config),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
