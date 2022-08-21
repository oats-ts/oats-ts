import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { flatMap } from 'lodash'
import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getAllRequestHeaders } from '../utils/cors/getAllRequestHeaders'
import { getAllResponseHeaders } from '../utils/cors/getAllResponseHeaders'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'
import { getCorsHandlerArrowFunctionAst } from '../utils/cors/getCorsHandlerArrowFunction'

export function getCorsMiddlewareAst(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ExpressCorsMiddlewareGeneratorConfig,
): Statement {
  const methods = Array.from(new Set(operations.map(({ method }) => method.toUpperCase())))
  const requestHeaders = Array.from(new Set(flatMap(operations, ({ parent }) => getAllRequestHeaders(parent, context))))
  const responseHeaders = Array.from(
    new Set(flatMap(operations, ({ parent }) => getAllResponseHeaders(parent, context))),
  )
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(context.nameOf(context.document, 'oats/express-cors-middleware')),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.RequestHandler), undefined),
          getCorsHandlerArrowFunctionAst(config.origins ?? [], methods, requestHeaders, responseHeaders),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
