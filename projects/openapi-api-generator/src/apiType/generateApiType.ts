import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiTypeAst } from './getApiTypeAst'
import { getApiTypeImports } from './getApiTypeImports'
import { ApiGeneratorConfig } from '../typings'

export function generateApiType(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  return {
    path: pathOf(doc, 'openapi/api-type'),
    dependencies: getApiTypeImports(doc, operations, context, true),
    content: [getApiTypeAst(doc, operations, context, config)],
  }
}
