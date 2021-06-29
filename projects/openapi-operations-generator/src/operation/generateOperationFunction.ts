import { hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationsGeneratorConfig } from '../typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getNamedImports, getRelativeImports } from '@oats-ts/typescript-common'
import { ImportDeclaration } from 'typescript'
import { getResponseMap } from '../returnType/getResponseMap'
import { values } from 'lodash'

export function generateOperationFunction(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const { operation } = data
  const operationPath = accessor.path(operation, 'operation')

  const relativeImports: [string, string][] = []
  if (hasInput(data, context)) {
    relativeImports.push([
      accessor.path(operation, 'operation-input-type'),
      accessor.name(operation, 'operation-input-type'),
    ])
  }

  if (values(getResponseMap(data.operation, context)).length > 0) {
    relativeImports.push([
      accessor.path(operation, 'operation-response-type'),
      accessor.name(operation, 'operation-response-type'),
    ])
    relativeImports.push([
      accessor.path(operation, 'operation-response-parser-hint'),
      accessor.name(operation, 'operation-response-parser-hint'),
    ])
  }

  if (data.path.length > 0) {
    relativeImports.push([
      accessor.path(operation, 'operation-path-serializer'),
      accessor.name(operation, 'operation-path-serializer'),
    ])
  }

  if (data.query.length > 0) {
    relativeImports.push([
      accessor.path(operation, 'operation-query-serializer'),
      accessor.name(operation, 'operation-query-serializer'),
    ])
  }

  if (data.header.length > 0) {
    relativeImports.push([
      accessor.path(operation, 'operation-headers-serializer'),
      accessor.name(operation, 'operation-headers-serializer'),
    ])
  }

  const imports: ImportDeclaration[] = [
    getNamedImports(RuntimePackages.ParameterSerialization.name, [RuntimePackages.ParameterSerialization.joinUrl]),
    getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig]),
    ...getRelativeImports(operationPath, relativeImports),
  ]

  return {
    path: operationPath,
    dependencies: imports,
    content: [getOperationFunctionAst(data, context, config)],
  }
}
