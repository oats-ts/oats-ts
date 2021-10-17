import { ParameterLocation } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, NodeFlags, VariableStatement } from 'typescript'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

const deserializerMap: Record<ParameterLocation, OpenAPIGeneratorTarget> = {
  query: 'openapi/query-deserializer',
  header: 'openapi/headers-deserializer',
  path: 'openapi/path-deserializer',
  cookie: undefined,
}

const issuesNameMap: Record<ParameterLocation, string> = {
  query: 'queryIssues',
  header: 'headerIssues',
  path: 'pathIssues',
  cookie: undefined,
}

const valueNameMap: Record<ParameterLocation, string> = {
  query: 'query',
  header: 'headers',
  path: 'path',
  cookie: undefined,
}

const configGetterNameMap: Record<ParameterLocation, string> = {
  query: 'getQueryParameters',
  header: 'getHeaderParameters',
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
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('configuration'),
                factory.createIdentifier(configGetterNameMap[location]),
              ),
              undefined,
              [factory.createIdentifier('request'), referenceOf(data.operation, deserializerMap[location])],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
  ]
}
