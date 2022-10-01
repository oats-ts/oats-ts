import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind, FunctionDeclaration } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'
import { getExpressRouterExpressionAst } from './getExpressRouterExpressionAst'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'

export function getExpressRouterAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouterFactoriesGeneratorConfig,
): FunctionDeclaration {
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    context.nameOf(data.operation, 'oats/express-router-factory'),
    [],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.router,
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createTypeReferenceNode(RuntimePackages.Express.IRouter),
      ),
    ],
    factory.createTypeReferenceNode(RuntimePackages.Express.IRouter),
    factory.createBlock([factory.createReturnStatement(getExpressRouterExpressionAst(data, context, config))]),
  )
}
