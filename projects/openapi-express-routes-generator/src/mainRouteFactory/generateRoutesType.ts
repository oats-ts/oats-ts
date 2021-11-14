import { TypeScriptModule } from '@oats-ts/typescript-writer'
import {
  EnhancedOperation,
  OpenAPIGeneratorContext,
  RuntimePackages,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { getMainRouteFactoryAst } from './getMainRouteFactoryAst'
import { ExpressRouteGeneratorConfig } from '../typings'

export function generateRoutesType(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
): TypeScriptModule {
  const { pathOf, document } = context
  const path = pathOf(document, 'openapi/express-main-route-factory')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router]),
      getNamedImports(RuntimePackages.HttpServer.name, [RuntimePackages.HttpServer.ServerConfiguration]),
      getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressParameters]),
      ...getModelImports<OpenAPIGeneratorTarget>(path, 'openapi/api-type', [document], context),
      ...getModelImports<OpenAPIGeneratorTarget>(path, 'openapi/express-routes-type', [document], context),
      ...getModelImports<OpenAPIGeneratorTarget>(
        path,
        'openapi/express-route',
        operations.map(({ operation }) => operation),
        context,
      ),
    ],
    content: [getMainRouteFactoryAst(operations, context, config)],
  }
}
