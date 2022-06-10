import { ParameterLocation } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { factory, NodeFlags, VariableStatement } from 'typescript'
import { RouterNames } from '../utils/RouterNames'

const deserializerMap: Record<ParameterLocation, OpenAPIGeneratorTarget> = {
  query: 'openapi/query-deserializer',
  header: 'openapi/request-headers-deserializer',
  path: 'openapi/path-deserializer',
  cookie: undefined,
}

const valueNameMap: Record<ParameterLocation, string> = {
  query: RouterNames.query,
  header: RouterNames.headers,
  path: RouterNames.path,
  cookie: undefined,
}

const configGetterNameMap: Record<ParameterLocation, string> = {
  query: 'getQueryParameters',
  header: 'getRequestHeaders',
  path: 'getPathParameters',
  cookie: undefined,
}

export function getParametersStatementAst(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): VariableStatement[] {
  if (data[location].length === 0) {
    return []
  }
  const { referenceOf } = context
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(valueNameMap[location]),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier(configGetterNameMap[location]),
                ),
                undefined,
                [factory.createIdentifier(RouterNames.toolkit), referenceOf(data.operation, deserializerMap[location])],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
  ]
}