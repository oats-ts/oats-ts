import { OpenAPIObject } from 'openapi3-ts'
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
  const { accessor } = context
  return {
    path: accessor.path(doc, 'api-type'),
    dependencies: getApiTypeImports(doc, operations, context),
    content: [getApiTypeAst(doc, operations, context, config)],
  }
}
