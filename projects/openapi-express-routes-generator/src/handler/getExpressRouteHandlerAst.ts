import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { getExpressRouteHandlerBodyAst } from './getExpressRouteHandlerBodyAst'
import { ExpressRouteGeneratorConfig } from '../typings'

export function getExpressRouteHandlerAst(
  doc: OpenAPIObject,
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
        'request',
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'response',
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'next',
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Express.NextFunction),
      ),
    ],
    factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getExpressRouteHandlerBodyAst(doc, data, context, config),
  )
}
