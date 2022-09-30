import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getPathTemplate } from '../utils/express/getPathTemplate'
import { getExpressRouterHandlerAst } from './getExpressRouterHandlerAst'

export function getExpressRouterExpressionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  const routerAst = factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], [])
  const url = getPathTemplate(data.url)
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(routerAst, data.method.toLowerCase()),
    [],
    [factory.createStringLiteral(url), getExpressRouterHandlerAst(data, context, config)],
  )
}
