import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getPathTemplate } from './getPathTemplate'
import { getExpressRouterHandlerAst } from './getExpressRouterHandlerAst'
import { getCorsHandlerArrowFunctionAst } from '../utils/cors/getCorsHandlerArrowFunction'
import { getAllMethods } from '../utils/cors/getAllMethods'
import { getAllRequestHeaders } from '../utils/cors/getAllRequestHeaders'
import { getAllResponseHeaders } from '../utils/cors/getAllResponseHeaders'

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
        [
          factory.createStringLiteral(url),
          getCorsHandlerArrowFunctionAst(
            Array.isArray(config.cors) ? config.cors : [],
            getAllMethods(data.parent),
            getAllRequestHeaders(data.parent, context),
            getAllResponseHeaders(data.parent, context),
          ),
        ],
      ),
      factory.createIdentifier(data.method.toLowerCase()),
    ),
    undefined,
    [factory.createStringLiteral(url), getExpressRouterHandlerAst(data, context, config)],
  )
}
