import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { EnhancedOperation, OperationsGeneratorConfig } from '../typings'
import { Http, Params } from '../../common/OatsPackages'
import { tsImportAst, tsRelativeImports } from '../../common/typeScriptUtils'

export function generateOperationFunction(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const { operation } = data
  const operationPath = accessor.path(operation, 'operation')

  return {
    path: operationPath,
    dependencies: [
      tsImportAst(Params.name, [Params.joinUrl]),
      tsImportAst(Http.name, [Http.RequestConfig, Http.HttpResponse]),
      ...tsRelativeImports(operationPath, [
        [accessor.path(operation, 'operation-response-type'), accessor.name(operation, 'operation-response-type')],
      ]),
    ],
    content: [getOperationFunctionAst(data, context, config)],
  }
}
