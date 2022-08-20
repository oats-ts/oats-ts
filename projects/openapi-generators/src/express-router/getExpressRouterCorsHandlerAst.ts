import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { getExpressRouterCorsHandlerBodyAst } from './getExpressRouterCorsHandlerBodyAst'
import { getExpressRouterHandlerParameters } from './getExpressRouterHandlerParameters'
import { ExpressRoutersGeneratorConfig } from './typings'

export function getExpressRouterCorsHandlerAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  return factory.createArrowFunction(
    undefined,
    undefined,
    getExpressRouterHandlerParameters(),
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getExpressRouterCorsHandlerBodyAst(data, context, config),
  )
}
