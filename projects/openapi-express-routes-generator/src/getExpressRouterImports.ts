import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getExpressRouterImports(
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  return [
    getNamedImports(RuntimePackages.Express.name, [
      RuntimePackages.Express.Router,
      RuntimePackages.Express.Request,
      RuntimePackages.Express.Response,
      RuntimePackages.Express.NextFunction,
    ]),
  ]
}
