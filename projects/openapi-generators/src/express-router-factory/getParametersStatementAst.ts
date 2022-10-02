import { ParameterLocation } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { factory, NodeFlags, VariableStatement } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'
import { isNil } from 'lodash'

const deserializerMap: Record<ParameterLocation, OpenAPIGeneratorTarget | undefined> = {
  query: 'oats/query-deserializer',
  header: 'oats/request-headers-deserializer',
  path: 'oats/path-deserializer',
  cookie: 'oats/cookie-deserializer',
}

const valueNameMap: Record<ParameterLocation, string | undefined> = {
  query: RouterNames.query,
  header: RouterNames.headers,
  path: RouterNames.path,
  cookie: RouterNames.cookies,
}

const configGetterNameMap: Record<ParameterLocation, string | undefined> = {
  query: 'getQueryParameters',
  header: 'getRequestHeaders',
  path: 'getPathParameters',
  cookie: 'getCookieParameters',
}

export function getParametersStatementAst(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): VariableStatement[] {
  if (data[location].length === 0) {
    return []
  }
  const valueName = valueNameMap[location]
  const configGetterName = configGetterNameMap[location]
  const deserializerName = deserializerMap[location]

  if (isNil(valueName) || isNil(configGetterName) || isNil(deserializerName)) {
    return []
  }

  const { referenceOf } = context
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(valueName),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier(configGetterName),
                ),
                undefined,
                [factory.createIdentifier(RouterNames.toolkit), referenceOf(data.operation, deserializerName)],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
  ]
}
