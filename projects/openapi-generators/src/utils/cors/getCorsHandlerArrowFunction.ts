import { ArrowFunction, Block, factory, SyntaxKind } from 'typescript'
import { getExpressRouterHandlerParameters } from '../getExpressRouterHandlerParameters'
import { AccessControlHeaders } from '../AccessControlHeaders'
import { getNextCall, getOriginAst, getOriginCheckExpression, getSetHeaderAst } from './corsUtils'

function getAddHeadersBlock(
  origins: string[],
  methods: string[],
  requestHeaders: string[],
  responseHeaders: string[],
): Block {
  const safeOrigin = factory.createBinaryExpression(
    getOriginAst(),
    SyntaxKind.QuestionQuestionToken,
    factory.createStringLiteral(origins.length > 0 ? '' : '*'),
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
      ...(origins.length === 0 ? [getNextCall()] : []),
    ],
    true,
  )
}

function getFunctionBodyBlock(
  origins: string[],
  methods: string[],
  requestHeaders: string[],
  responseHeaders: string[],
): Block {
  if (origins.length === 0) {
    return getAddHeadersBlock(origins, methods, requestHeaders, responseHeaders)
  }
  return factory.createBlock(
    [
      factory.createIfStatement(
        getOriginCheckExpression(origins),
        getAddHeadersBlock(origins, methods, requestHeaders, responseHeaders),
        undefined,
      ),
      getNextCall(),
    ],
    true,
  )
}

export function getCorsHandlerArrowFunctionAst(
  origins: string[],
  methods: string[],
  requestHeaders: string[],
  responseHeaders: string[],
): ArrowFunction {
  return factory.createArrowFunction(
    undefined,
    undefined,
    getExpressRouterHandlerParameters(),
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getFunctionBodyBlock(origins, methods, requestHeaders, responseHeaders),
  )
}
