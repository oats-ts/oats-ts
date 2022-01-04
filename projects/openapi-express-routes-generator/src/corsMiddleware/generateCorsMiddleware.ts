import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getCorsMiddlewareAst } from './getCorsMiddlewareAst'

export function generateCorsMiddleware(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { pathOf, document } = context
  const path = pathOf(document, 'openapi/express-cors-middleware')
  return {
    path,
    content: [getCorsMiddlewareAst(operations, context)],
    dependencies: [
      getNamedImports(RuntimePackages.Express.name, [
        RuntimePackages.Express.RequestHandler,
        RuntimePackages.Express.Request,
        RuntimePackages.Express.Response,
        RuntimePackages.Express.NextFunction,
      ]),
    ],
  }
}
