import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getHandlerBodyAst } from './getHandlerBodyAst'
import { getExpressRouterHandlerParameters } from '../utils/getExpressRouterHandlerParameters'

export function getExpressRouterHandlerAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  return factory.createArrowFunction(
    [factory.createModifier(SyntaxKind.AsyncKeyword)],
    [],
    getExpressRouterHandlerParameters(),
    factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getHandlerBodyAst(data, context, config),
  )
}
