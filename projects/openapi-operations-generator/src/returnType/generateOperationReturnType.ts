import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationReturnTypeImports } from './getOperationReturnTypeImports'
import { getReturnTypeAst } from './getReturnTypeAst'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getResponseMap } from './getResponseMap'
import { has } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateOperationReturnType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { accessor } = context
  const schemas = getResponseMap(data.operation, context)
  return {
    path: accessor.path(data.operation, 'operation-response-type'),
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.HttpResponse]),
      ...(has(schemas, 'default')
        ? [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.StatusCode])]
        : []),
      ...getOperationReturnTypeImports(data.operation, context),
    ],
    content: [getReturnTypeAst(data, context)],
  }
}