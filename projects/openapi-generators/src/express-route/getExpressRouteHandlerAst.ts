import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ExpressRouteGeneratorConfig } from './typings'
import { getHandlerBodyAst } from './getHandlerBodyAst'
import { RouterNames } from '../utils/RouterNames'

export function getExpressRouteHandlerAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
) {
  return factory.createArrowFunction(
    [factory.createModifier(SyntaxKind.AsyncKeyword)],
    [],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.request,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.response,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.next,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.NextFunction),
      ),
    ],
    factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getHandlerBodyAst(data, context, config),
  )
}
