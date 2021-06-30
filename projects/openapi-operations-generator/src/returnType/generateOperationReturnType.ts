import { getResponseSchemas, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getReturnTypeAst } from './getReturnTypeAst'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { has, flatMap, values } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateOperationReturnType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { accessor } = context
  const schemas = getResponseSchemas(data.operation, context)
  const path = accessor.path(data.operation, 'operation-response-type')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.HttpResponse]),
      ...(has(schemas, 'default')
        ? [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.StatusCode])]
        : []),
      ...flatMap(values(getResponseSchemas(data.operation, context)), (schema) =>
        accessor.dependencies(path, schema, 'type'),
      ),
    ],
    content: [getReturnTypeAst(data, context)],
  }
}
