import { OpenAPIObject } from 'openapi3-ts'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getApiClassAst } from './getApiClassAst'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ApiGeneratorConfig } from '../typings'
import { flatMap } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateApiClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(doc, 'openapi/api-class')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...accessor.dependencies(path, doc, 'openapi/api-type'),
      ...flatMap(operations, ({ operation }) => accessor.dependencies(path, operation, 'openapi/operation')),
    ],
    content: [getApiClassAst(doc, operations, context, config)],
  }
}
