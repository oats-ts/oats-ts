import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export function getExpressRouterImports(
  doc: OpenAPIObject,
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(operation.operation, 'openapi/express-route')
  return [
    getNamedImports(RuntimePackages.HttpServer.name, [RuntimePackages.HttpServer.ServerConfiguration]),
    getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressParameters]),
    getNamedImports(RuntimePackages.Express.name, [
      RuntimePackages.Express.Router,
      RuntimePackages.Express.Request,
      RuntimePackages.Express.Response,
      RuntimePackages.Express.NextFunction,
    ]),
    ...dependenciesOf(path, doc, 'openapi/api-type'),
    ...dependenciesOf(path, operation.operation, 'openapi/path-deserializer'),
    ...dependenciesOf(path, operation.operation, 'openapi/query-deserializer'),
    ...dependenciesOf(path, operation.operation, 'openapi/request-headers-deserializer'),
  ]
}
