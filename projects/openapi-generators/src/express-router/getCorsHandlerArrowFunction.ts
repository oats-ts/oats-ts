import { ArrowFunction, Block, factory, SyntaxKind } from 'typescript'
import { getExpressRouterHandlerParameters } from '../utils/getExpressRouterHandlerParameters'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getAdapterStatement, getCatchBlock, getToolkitStatement } from './common'
import { RouterNames } from '../utils/RouterNames'
import { getPreflightCorsParameters } from './cors/getPreflightCorsParameters'

function getFunctionBodyBlock(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
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
      getCatchBlock(),
    ),
    undefined,
  )
  return factory.createBlock([getToolkitStatement(), getAdapterStatement(config), tryCatch], true)
}

export function getCorsHandlerArrowFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
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
