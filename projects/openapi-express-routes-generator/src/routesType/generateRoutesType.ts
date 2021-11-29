import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getRoutesTypeAst } from './getRoutesTypeAst'

export function generateRoutesType(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { pathOf, document } = context
  return {
    path: pathOf(document, 'openapi/express-routes-type'),
    dependencies: [getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router])],
    content: [getRoutesTypeAst(operations, context)],
  }
}
