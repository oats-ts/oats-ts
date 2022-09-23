import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getPathTemplate } from './getPathTemplate'
import { getExpressRouterHandlerAst } from './getExpressRouterHandlerAst'
import { getCorsHandlerArrowFunctionAst } from './getCorsHandlerArrowFunction'

export function getExpressRouterExpressionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  const routerAst = factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], [])
  const url = getPathTemplate(data.url)

  if (config.cors === false) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(routerAst, data.method.toLowerCase()),
      [],
      [factory.createStringLiteral(url), getExpressRouterHandlerAst(data, context, config)],
    )
  }

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(routerAst, factory.createIdentifier('options')),
        undefined,
        [factory.createStringLiteral(url), getCorsHandlerArrowFunctionAst(data, context, config)],
      ),
      factory.createIdentifier(data.method.toLowerCase()),
    ),
    undefined,
    [factory.createStringLiteral(url), getExpressRouterHandlerAst(data, context, config)],
  )
}
