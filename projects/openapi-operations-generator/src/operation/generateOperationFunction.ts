import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationsGeneratorConfig } from '../typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateOperationFunction(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const { operation } = data
  const path = accessor.path(operation, 'operation')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.ParameterSerialization.name, [RuntimePackages.ParameterSerialization.joinUrl]),
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig, RuntimePackages.Http.execute]),
      ...accessor.dependencies(path, data.operation, 'operation-input-type'),
      ...accessor.dependencies(path, data.operation, 'operation-response-type'),
      ...accessor.dependencies(path, data.operation, 'operation-path-serializer'),
      ...accessor.dependencies(path, data.operation, 'operation-query-serializer'),
      ...accessor.dependencies(path, data.operation, 'operation-headers-serializer'),
      ...(config.validate ? accessor.dependencies(path, data.operation, 'operation-response-parser-hint') : []),
    ],
    content: [getOperationFunctionAst(data, context, config)],
  }
}
