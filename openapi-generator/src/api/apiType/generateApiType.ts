import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '../../operations/typings'
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
    imports: getApiTypeImports(doc, operations, context),
    path: accessor.path(doc, 'api-type'),
    statements: [getApiTypeAst(doc, operations, context, config)],
  }
}
