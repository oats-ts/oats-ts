import {
  EnhancedOperation,
  getRequestBodyContent,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { flatMap, isNil, values } from 'lodash'

export function getExpressRouterImports(
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { pathOf, dependenciesOf, document } = context
  const path = pathOf(operation.operation, 'oats/express-router')
  const bodyTypesImports = flatMap(
    values(getRequestBodyContent(operation, context)).filter((mediaType) => !isNil(mediaType?.schema)),
    (mediaType): ImportDeclaration[] => dependenciesOf(path, mediaType.schema, 'oats/type'),
  )
  return [
    getNamedImports(RuntimePackages.Http.name, [
      RuntimePackages.Http.RawHttpResponse,
      RuntimePackages.Http.ServerAdapter,
    ]),
    getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressToolkit]),
    getNamedImports(RuntimePackages.Express.name, [
      RuntimePackages.Express.Router,
      RuntimePackages.Express.Request,
      RuntimePackages.Express.Response,
      RuntimePackages.Express.NextFunction,
    ]),
    ...dependenciesOf(path, document, 'oats/api-type'),
    ...dependenciesOf(path, operation.operation, 'oats/path-deserializer'),
    ...dependenciesOf(path, operation.operation, 'oats/query-deserializer'),
    ...dependenciesOf(path, operation.operation, 'oats/request-headers-deserializer'),
    ...dependenciesOf(path, operation.operation, 'oats/request-body-validator'),
    ...dependenciesOf(path, operation.operation, 'oats/request-server-type'),
    ...dependenciesOf(path, operation.operation, 'oats/response-headers-serializer'),
    ...dependenciesOf(path, operation.operation, 'oats/cookie-deserializer'),
    ...dependenciesOf(path, operation.operation, 'oats/set-cookie-serializer'),
    ...bodyTypesImports,
  ]
}
