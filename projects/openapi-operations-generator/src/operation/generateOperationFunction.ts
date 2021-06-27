import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationsGeneratorConfig } from '../typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports, getRelativeImports } from '@oats-ts/typescript-common'

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
      getNamedImports(RuntimePackages.ParameterSerialization.name, [RuntimePackages.ParameterSerialization.joinUrl]),
      getNamedImports(RuntimePackages.Http.name, [
        RuntimePackages.Http.RequestConfig,
        RuntimePackages.Http.HttpResponse,
      ]),
      ...getRelativeImports(operationPath, [
        [accessor.path(operation, 'operation-response-type'), accessor.name(operation, 'operation-response-type')],
      ]),
    ],
    content: [getOperationFunctionAst(data, context, config)],
  }
}
