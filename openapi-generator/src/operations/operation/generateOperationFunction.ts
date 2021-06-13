import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { getOperationReturnTypeImports } from '../returnType/generateOperationReturnType'
import { importAst } from '../../babelUtils'
import { OatsModules } from '../../packageUtils'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { EnhancedOperation } from '../typings'

export function generateOperationFunction(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const { operation } = data

  return {
    imports: [
      importAst(OatsModules.Param, ['joinUrl']),
      importAst(OatsModules.Http, ['RequestConfig', 'HttpResponse']),
      ...getOperationReturnTypeImports(operation, context),
    ],
    path: accessor.path(operation, 'operation'),
    statements: [getOperationFunctionAst(data, context)],
  }
}
