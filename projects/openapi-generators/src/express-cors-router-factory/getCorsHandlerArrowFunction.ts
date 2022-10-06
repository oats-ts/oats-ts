import { ArrowFunction, Block, factory, SyntaxKind } from 'typescript'
import { getExpressRouterHandlerParameters } from '../utils/getExpressRouterHandlerParameters'
import { EnhancedPathItem, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getAdapterStatement } from '../utils/express/getAdapterStatement'
import { RouterNames } from '../utils/express/RouterNames'
import { getPreflightCorsParameters } from './getPreflightCorsParameters'
import { ExpressCorsRouterFactoryGeneratorConfig } from './typings'
import { getRouterCatchBlock } from '../utils/express/getRouterCatchBlock'
import { getToolkitStatement } from '../utils/express/getToolkitStatement'

function getFunctionBodyBlock(
  data: EnhancedPathItem,
  context: OpenAPIGeneratorContext,
  config: ExpressCorsRouterFactoryGeneratorConfig,
): Block {
  const respondStatement = factory.createExpressionStatement(
    factory.createAwaitExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterNames.adapter),
          factory.createIdentifier(RouterNames.respond),
        ),
        undefined,
        [
          factory.createIdentifier(RouterNames.toolkit),
          factory.createObjectLiteralExpression([
            factory.createPropertyAssignment(
              RouterNames.headers,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(RouterNames.adapter),
                    factory.createIdentifier(RouterNames.getPreflightCorsHeaders),
                  ),
                  undefined,
                  getPreflightCorsParameters(data, context, config),
                ),
              ),
            ),
          ]),
        ],
      ),
    ),
  )
  const tryBlock = factory.createBlock([respondStatement])

  const tryCatch = factory.createTryStatement(
    tryBlock,
    factory.createCatchClause(
      factory.createVariableDeclaration(factory.createIdentifier(RouterNames.error), undefined, undefined, undefined),
      getRouterCatchBlock(),
    ),
    undefined,
  )
  return factory.createBlock([getToolkitStatement(), getAdapterStatement(context), tryCatch], true)
}

export function getCorsHandlerArrowFunctionAst(
  data: EnhancedPathItem,
  context: OpenAPIGeneratorContext,
  config: ExpressCorsRouterFactoryGeneratorConfig,
): ArrowFunction {
  return factory.createArrowFunction(
    [factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    getExpressRouterHandlerParameters(),
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getFunctionBodyBlock(data, context, config),
  )
}
