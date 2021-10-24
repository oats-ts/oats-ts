import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateOperationFunction(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const { operation } = data
  const path = pathOf(operation, 'openapi/operation')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.ParameterSerialization.name, [RuntimePackages.ParameterSerialization.joinUrl]),
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientConfiguration]),
      getNamedImports(RuntimePackages.HttpClient.name, [RuntimePackages.HttpClient.execute]),
      ...dependenciesOf(path, data.operation, 'openapi/request-type'),
      ...dependenciesOf(path, data.operation, 'openapi/response-type'),
      ...dependenciesOf(path, data.operation, 'openapi/path-serializer'),
      ...dependenciesOf(path, data.operation, 'openapi/query-serializer'),
      ...dependenciesOf(path, data.operation, 'openapi/request-headers-serializer'),
      ...(config.validate ? dependenciesOf(path, data.operation, 'openapi/response-body-validator') : []),
    ],
    content: [getOperationFunctionAst(data, context, config)],
  }
}
