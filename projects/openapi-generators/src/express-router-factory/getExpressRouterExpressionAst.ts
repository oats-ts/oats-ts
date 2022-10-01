import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'
import { getPathTemplate } from '../utils/express/getPathTemplate'
import { getExpressRouterHandlerAst } from './getExpressRouterHandlerAst'
import { RouterNames } from '../utils/express/RouterNames'

export function getExpressRouterExpressionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouterFactoriesGeneratorConfig,
) {
  const routerAst = factory.createBinaryExpression(
    factory.createIdentifier(RouterNames.router),
    SyntaxKind.QuestionQuestionToken,
    factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
  )
  const url = getPathTemplate(data.url)
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(routerAst, data.method.toLowerCase()),
    [],
    [factory.createStringLiteral(url), getExpressRouterHandlerAst(data, context, config)],
  )
}
