import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ExpressRouteGeneratorConfig } from './typings'
import { Names } from './Names'
import { getHandlerBodyAst } from './getHandlerBodyAst'

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
        Names.request,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        Names.response,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        Names.next,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.NextFunction),
      ),
    ],
    factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getHandlerBodyAst(data, context, config),
  )
}
