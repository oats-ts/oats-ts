import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeAst } from './getApiTypeAst'
import { getApiTypeImports } from './getApiTypeImports'

export function generateApiType(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context
  return {
    imports: getApiTypeImports(doc, operations, context),
    path: accessor.path(doc, 'api-type'),
    statements: [getApiTypeAst(doc, operations, context)],
  }
}
