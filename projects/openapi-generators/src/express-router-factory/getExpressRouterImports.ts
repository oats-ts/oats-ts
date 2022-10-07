import {
  EnhancedOperation,
  getRequestBodyContent,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { flatMap, isNil, values } from 'lodash'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'

export function getExpressRouterImports(
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouterFactoriesGeneratorConfig,
): ImportDeclaration[] {
  const path = context.pathOf(operation.operation, 'oats/express-router-factory')
  const bodyTypesImports = flatMap(
    values(getRequestBodyContent(operation, context)).filter((mediaType) => !isNil(mediaType?.schema)),
    (mediaType): ImportDeclaration[] => context.dependenciesOf(path, mediaType.schema, 'oats/type'),
  )
  return [
    getNamedImports(RuntimePackages.Http.name, [
      RuntimePackages.Http.RawHttpResponse,
      RuntimePackages.Http.ServerAdapter,
    ]),
    getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressToolkit]),
    getNamedImports(RuntimePackages.Express.name, [
      RuntimePackages.Express.IRouter,
      RuntimePackages.Express.Router,
      RuntimePackages.Express.Request,
      RuntimePackages.Express.Response,
      RuntimePackages.Express.NextFunction,
    ]),
    ...context.dependenciesOf(path, context.document, 'oats/api-type'),
    ...context.dependenciesOf(path, operation.operation, 'oats/path-deserializer'),
    ...context.dependenciesOf(path, operation.operation, 'oats/query-deserializer'),
    ...context.dependenciesOf(path, operation.operation, 'oats/request-headers-deserializer'),
    ...context.dependenciesOf(path, operation.operation, 'oats/request-body-validator'),
    ...context.dependenciesOf(path, operation.operation, 'oats/request-server-type'),
    ...context.dependenciesOf(path, operation.operation, 'oats/response-headers-serializer'),
    ...context.dependenciesOf(path, operation.operation, 'oats/cookie-deserializer'),
    ...context.dependenciesOf(path, operation.operation, 'oats/set-cookie-serializer'),
    ...(config.cors ? context.dependenciesOf(path, context.document, 'oats/cors-configuration') : []),
    ...bodyTypesImports,
  ]
}
