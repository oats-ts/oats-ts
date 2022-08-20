import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLogicalExpression } from '@oats-ts/typescript-common'
import { Block, Expression, factory, SyntaxKind } from 'typescript'
import { AccessControlHeaders } from '../utils/AccessControlHeaders'
import { getAllMethods } from '../utils/getAllMethods'
import { getAllRequestHeaders } from '../utils/getAllRequestHeaders'
import { getAllResponseHeaders } from '../utils/getAllResponseHeaders'
import { getSetHeaderAst } from '../utils/getSetHeaderAst'
import { RouterNames } from '../utils/RouterNames'
import { ExpressRoutersGeneratorConfig } from './typings'

function getOriginAst(): Expression {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(RouterNames.request),
      factory.createIdentifier(RouterNames.header),
    ),
    undefined,
    [factory.createStringLiteral(RouterNames.origin)],
  )
}

function getOriginEqualsExpression(value: string) {
  return factory.createBinaryExpression(
    getOriginAst(),
    SyntaxKind.EqualsEqualsEqualsToken,
    factory.createStringLiteral(value),
  )
}

function getOriginCheckExpression(values: string[]) {
  return getLogicalExpression(SyntaxKind.BarBarToken, values.map(getOriginEqualsExpression))
}

function getNextCall() {
  return factory.createExpressionStatement(
    factory.createCallExpression(factory.createIdentifier(RouterNames.next), [], []),
  )
}

function getAddHeadersBlock(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  const { cors } = config
  const methods = getAllMethods(data.parent)
  const responseHeaders = getAllResponseHeaders(data.parent, context)
  const requestHeaders = getAllRequestHeaders(data.parent, context)
  const hasOrig = hasOrigin(cors)

  const safeOrigin = factory.createBinaryExpression(
    getOriginAst(),
    SyntaxKind.QuestionQuestionToken,
    factory.createStringLiteral(hasOrig ? '' : '*'),
  )

  return factory.createBlock(
    [
      getSetHeaderAst(AccessControlHeaders.AllowOrigin, safeOrigin),
      ...(methods.length > 0
        ? [getSetHeaderAst(AccessControlHeaders.AllowMethods, factory.createStringLiteral(methods.join(', ')))]
        : []),
      ...(requestHeaders.length > 0
        ? [getSetHeaderAst(AccessControlHeaders.AllowHeaders, factory.createStringLiteral(requestHeaders.join(', ')))]
        : []),
      ...(responseHeaders.length > 0
        ? [getSetHeaderAst(AccessControlHeaders.ExposeHeaders, factory.createStringLiteral(responseHeaders.join(', ')))]
        : []),
      ...(cors === true || !hasOrig ? [getNextCall()] : []),
    ],
    true,
  )
}

function hasOrigin(cors: boolean | string[]) {
  return !Array.isArray(cors) || cors.length > 0
}

export function getExpressRouterCorsHandlerBodyAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): Block {
  const { cors } = config
  if (cors === false) {
    throw new Error(`getExpressRouterCorsHandlerBodyAst should not have been called with cors: false`)
  } else if (cors === true || !hasOrigin(cors)) {
    return getAddHeadersBlock(data, context, config)
  }
  return factory.createBlock(
    [
      factory.createIfStatement(getOriginCheckExpression(cors), getAddHeadersBlock(data, context, config), undefined),
      getNextCall(),
    ],
    true,
  )
}
