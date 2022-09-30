import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind, FunctionDeclaration } from 'typescript'
import { getExpressRouterExpressionAst } from './getExpressRouterExpressionAst'
import { ExpressRoutersGeneratorConfig } from './typings'

export function getExpressRouterAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): FunctionDeclaration {
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    context.nameOf(data.operation, 'oats/express-router'),
    [],
    [],
    factory.createTypeReferenceNode(RuntimePackages.Express.Router),
    factory.createBlock([factory.createReturnStatement(getExpressRouterExpressionAst(data, context, config))]),
  )
}
