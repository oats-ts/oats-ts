import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { getOperationReturnTypeImports } from './getOperationReturnTypeImports'
import { getReturnTypeAst } from './getReturnTypeAst'
import { EnhancedOperation } from '../typings'
import { importAst } from '../../common/babelUtils'
import { Http } from '../../common/OatsPackages'
import { getResponseMap } from './getResponseMap'
import { has } from 'lodash'

export function generateOperationReturnType(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const schemas = getResponseMap(data.operation, context)
  return {
    imports: [
      importAst(Http.name, [Http.ResponseParserHint]),
      ...(has(schemas, 'default') ? [importAst(Http.name, [Http.StatusCode])] : []),
      ...getOperationReturnTypeImports(data.operation, context),
    ],
    path: accessor.path(data.operation, 'operation-return-type'),
    statements: [getReturnTypeAst(data, context)],
  }
}
