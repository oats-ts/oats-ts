import { EnhancedPathItem, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { Expression, factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getPathTemplate } from '../express-router/getPathTemplate'
import { getCorsHandlerArrowFunctionAst } from './getCorsHandlerArrowFunction'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'

function getCorsRouterExpression(
  paths: EnhancedPathItem[],
  context: OpenAPIGeneratorContext,
  config: ExpressCorsMiddlewareGeneratorConfig,
): Expression {
  const routerExpr = factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], [])
  return Array.from(paths)
    .reverse()
    .reduce((prevExpr, pathItem) => {
      return factory.createCallExpression(
        factory.createPropertyAccessExpression(prevExpr, 'options'),
        [],
        [
          factory.createStringLiteral(getPathTemplate(pathItem.url)),
          getCorsHandlerArrowFunctionAst(pathItem, context, config),
        ],
      )
    }, routerExpr)
}

export function getCorsMiddlewareAst(
  paths: EnhancedPathItem[],
  context: OpenAPIGeneratorContext,
  config: ExpressCorsMiddlewareGeneratorConfig,
): Statement {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(context.nameOf(context.document, 'oats/express-cors-middleware')),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Express.Router),
          getCorsRouterExpression(paths, context, config),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
