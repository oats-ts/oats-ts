import {
  EnhancedPathItem,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { Expression, factory, Statement, SyntaxKind } from 'typescript'
import { getPathTemplate } from '../utils/express/getPathTemplate'
import { RouterNames } from '../utils/express/RouterNames'
import { getCorsHandlerArrowFunctionAst } from './getCorsHandlerArrowFunction'

function getCorsRouterExpression(paths: EnhancedPathItem[], context: OpenAPIGeneratorContext): Expression {
  const routerExpr: Expression = factory.createBinaryExpression(
    factory.createIdentifier(RouterNames.router),
    SyntaxKind.QuestionQuestionToken,
    factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
  )
  return Array.from(paths)
    .reverse()
    .reduce((prevExpr: Expression, pathItem: EnhancedPathItem) => {
      return factory.createCallExpression(
        factory.createPropertyAccessExpression(prevExpr, 'options'),
        [],
        [factory.createStringLiteral(getPathTemplate(pathItem.url)), getCorsHandlerArrowFunctionAst(pathItem, context)],
      )
    }, routerExpr)
}

const target: OpenAPIGeneratorTarget = 'oats/express-cors-router-factory'

const warningLabel = `WARNING: CORS router factory found no allowed origins for any operations, and likely needs to be configured!

- If you don't need CORS, remove "${target}" from your configuration.
- If you need CORS, please provide at least the getAllowedOrigins options for "${target}".
- More info on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- More info on configuring generators: https://oats-ts.github.io/docs/#/docs/OpenAPI_Generate`

export function getCorsRouterFactoryAst(paths: EnhancedPathItem[], context: OpenAPIGeneratorContext): Statement {
  const fnNode = factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(context.nameOf(context.document, 'oats/express-cors-router-factory')),
    undefined,
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
    factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.IRouter), undefined),
    factory.createBlock([factory.createReturnStatement(getCorsRouterExpression(paths, context))], true),
  )

  return paths.length === 0 ? documentNode(fnNode, { description: warningLabel }) : fnNode
}
