import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationReturnTypeImports } from './getOperationReturnTypeImports'
import { getReturnTypeAst } from './getReturnTypeAst'
import { EnhancedOperation } from '../typings'
import { Http } from '../../common/OatsPackages'
import { getResponseMap } from './getResponseMap'
import { has } from 'lodash'
import { tsImportAst } from '../../common/typeScriptUtils'

export function generateOperationReturnType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { accessor } = context
  const schemas = getResponseMap(data.operation, context)
  return {
    imports: [
      tsImportAst(Http.name, [Http.HttpResponse]),
      ...(has(schemas, 'default') ? [tsImportAst(Http.name, [Http.StatusCode])] : []),
      ...getOperationReturnTypeImports(data.operation, context),
    ],
    path: accessor.path(data.operation, 'operation-response-type'),
    statements: [getReturnTypeAst(data, context)],
  }
}
