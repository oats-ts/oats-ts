import { OpenAPIObject } from 'openapi3-ts'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiStubAst } from './getApiStubAst'
import { ApiGeneratorConfig } from '../typings'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateApiStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(doc, 'openapi/api-stub')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...accessor.dependencies(path, doc, 'openapi/api-type'),
    ],
    content: [getApiStubAst(doc, operations, context, config)],
  }
}
