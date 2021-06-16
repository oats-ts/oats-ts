import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../typings'
import { getRequestsTypeAst } from './getRequestsTypeAst'
import { getRequestsTypeImports } from './getRequestsTypeImports'

export function generateRequestsType(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context
  return {
    imports: getRequestsTypeImports(doc, operations, context),
    path: accessor.path(doc, 'requests-type'),
    statements: [getRequestsTypeAst(doc, operations, context)],
  }
}
