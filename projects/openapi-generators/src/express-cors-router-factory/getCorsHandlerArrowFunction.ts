import { ArrowFunction, Block, factory, NodeFlags, SyntaxKind } from 'typescript'
import { getExpressRouterHandlerParameters } from '../utils/getExpressRouterHandlerParameters'
import { EnhancedPathItem, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getAdapterStatement } from '../utils/express/getAdapterStatement'
import { RouterNames } from '../utils/express/RouterNames'
import { getRouterCatchBlock } from '../utils/express/getRouterCatchBlock'
import { getToolkitStatement } from '../utils/express/getToolkitStatement'

function getFunctionBodyBlock(data: EnhancedPathItem, context: OpenAPIGeneratorContext): Block {
  const methodStatement = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.method),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterNames.adapter),
              factory.createIdentifier(RouterNames.getAccessControlRequestedMethod),
            ),
            undefined,
            [factory.createIdentifier(RouterNames.toolkit)],
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const corsConfigStatement = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.corsConfig),
          undefined,
          undefined,
          factory.createConditionalExpression(
            factory.createBinaryExpression(
              factory.createIdentifier(RouterNames.method),
              factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
              factory.createIdentifier('undefined'),
            ),
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createIdentifier('undefined'),
            factory.createToken(SyntaxKind.ColonToken),
            factory.createElementAccessChain(
              factory.createElementAccessChain(
                context.referenceOf(context.document, 'oats/cors-configuration'),
                factory.createToken(SyntaxKind.QuestionDotToken),
                factory.createStringLiteral(data.url),
              ),
              factory.createToken(SyntaxKind.QuestionDotToken),
              factory.createIdentifier(RouterNames.method),
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const corsHeadersStatement = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.corsHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.adapter),
                factory.createIdentifier(RouterNames.getPreflightCorsHeaders),
              ),
              undefined,
              [
                factory.createIdentifier(RouterNames.toolkit),
                factory.createIdentifier(RouterNames.method),
                factory.createIdentifier(RouterNames.corsConfig),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

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
            factory.createPropertyAssignment(RouterNames.headers, factory.createIdentifier(RouterNames.corsHeaders)),
          ]),
        ],
      ),
    ),
  )
  const tryBlock = factory.createBlock([methodStatement, corsConfigStatement, corsHeadersStatement, respondStatement])

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
): ArrowFunction {
  return factory.createArrowFunction(
    [factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    getExpressRouterHandlerParameters(),
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getFunctionBodyBlock(data, context),
  )
}
