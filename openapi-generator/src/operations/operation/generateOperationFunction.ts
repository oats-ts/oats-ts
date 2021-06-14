import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { importAst } from '../../common/babelUtils'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { EnhancedOperation } from '../typings'
import { Http, Params } from '../../common/OatsPackages'
import { getOperationReturnTypeImports } from '../returnType/getOperationReturnTypeImports'
import { isReturnTypeRequired } from '../returnType/isReturnTypeRequired'
import { getResponseSchemas } from '../returnType/getResponseSchemas'
import { getImports } from '../../common/getImports'

export function generateOperationFunction(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const { operation } = data
  const operationPath = accessor.path(operation, 'operation')
  const returnTypeImports = isReturnTypeRequired(getResponseSchemas(operation, context), context)
    ? getImports(operationPath, [
        [accessor.path(operation, 'operation-return-type'), accessor.name(operation, 'operation-return-type')],
      ])
    : getOperationReturnTypeImports(operation, context)

  return {
    imports: [
      importAst(Params.name, [Params.joinUrl]),
      importAst(Http.name, [Http.RequestConfig, Http.HttpResponse]),
      ...returnTypeImports,
    ],
    path: operationPath,
    statements: [getOperationFunctionAst(data, context)],
  }
}
