import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '../../../../babel-writer/lib'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { EnhancedOperation } from '../typings'
import { Http, Params } from '../../common/OatsPackages'
import { tsImportAst, tsRelativeImports } from '../../common/typeScriptUtils'

export function generateOperationFunction(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule {
  const { accessor } = context
  const { operation } = data
  const operationPath = accessor.path(operation, 'operation')

  return {
    imports: [
      tsImportAst(Params.name, [Params.joinUrl]),
      tsImportAst(Http.name, [Http.RequestConfig, Http.HttpResponse]),
      ...tsRelativeImports(operationPath, [
        [accessor.path(operation, 'operation-return-type'), accessor.name(operation, 'operation-return-type')],
      ]),
    ],
    path: operationPath,
    statements: [getOperationFunctionAst(data, context)],
  }
}
