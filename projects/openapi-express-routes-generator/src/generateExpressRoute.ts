import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ExpressRouteGeneratorConfig } from './typings'
import { getExpressRouteAst } from './getExpressRouteAst'
import { getExpressRouterImports } from './getExpressRouterImports'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export function generateExpressRoute(
  doc: OpenAPIObject,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  return {
    path: pathOf(data.operation, 'openapi/express-route'),
    dependencies: getExpressRouterImports(doc, data, context),
    content: [getExpressRouteAst(doc, data, context, config)],
  }
}
