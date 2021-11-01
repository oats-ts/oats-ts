import { ParameterLocation } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, NodeFlags, VariableStatement } from 'typescript'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { Names } from './Names'

const deserializerMap: Record<ParameterLocation, OpenAPIGeneratorTarget> = {
  query: 'openapi/query-deserializer',
  header: 'openapi/request-headers-deserializer',
  path: 'openapi/path-deserializer',
  cookie: undefined,
}

const issuesNameMap: Record<ParameterLocation, string> = {
  query: Names.queryIssues,
  header: Names.headerIssues,
  path: Names.pathIssues,
  cookie: undefined,
}

const valueNameMap: Record<ParameterLocation, string> = {
  query: Names.query,
  header: Names.headers,
  path: Names.path,
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
            factory.createArrayBindingPattern([
              factory.createBindingElement(
                undefined,
                undefined,
                factory.createIdentifier(issuesNameMap[location]),
                undefined,
              ),
              factory.createBindingElement(
                undefined,
                undefined,
                factory.createIdentifier(valueNameMap[location]),
                undefined,
              ),
            ]),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(Names.configuration),
                  factory.createIdentifier(configGetterNameMap[location]),
                ),
                undefined,
                [factory.createIdentifier(Names.frameworkInput), referenceOf(data.operation, deserializerMap[location])],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
  ]
}
