import { factory, NodeFlags } from 'typescript'
import { Names } from './names'
import { EnhancedOperation, hasRequestBody, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getBodyStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  if (!hasRequestBody(data, context)) {
    return []
  }
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createArrayBindingPattern([
              factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.bodyIssues), undefined),
              factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.body), undefined),
              factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.mimeType), undefined),
            ]),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getRequestBody'),
              ),
              undefined,
              [factory.createIdentifier(Names.request), factory.createIdentifier('undefined')],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
  ]
}
