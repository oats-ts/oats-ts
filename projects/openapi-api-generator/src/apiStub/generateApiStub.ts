import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiStubAst } from './getApiStubAst'
import { ApiGeneratorConfig } from '../typings'

export function generateApiStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'openapi/api-stub')
  return {
    path,
    dependencies: [
      ...getApiTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'openapi/api-type'),
    ],
    content: [getApiStubAst(doc, operations, context, config)],
  }
}
