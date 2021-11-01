import { EnhancedOperation, hasRequestBody, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, NodeFlags, VariableStatement } from 'typescript'
import { Names } from './Names'

export function getRequestBodyRelatedStatementAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): VariableStatement[] {
  if (!hasRequestBody(data, context)) {
    return []
  }
  const { referenceOf } = context
  const mimeType = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createArrayBindingPattern([
            factory.createBindingElement(
              undefined,
              undefined,
              factory.createIdentifier(Names.mimeTypeIssues),
              undefined,
            ),
            factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.mimeType), undefined),
          ]),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getMimeType'),
              ),
              undefined,
              [
                factory.createIdentifier(Names.frameworkInput),
                referenceOf(data.operation, 'openapi/request-body-validator'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const body = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createArrayBindingPattern([
            factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.bodyIssues), undefined),
            factory.createBindingElement(undefined, undefined, factory.createIdentifier(Names.body), undefined),
          ]),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier('getRequestBody'),
              ),
              undefined,
              [
                factory.createIdentifier(Names.frameworkInput),
                factory.createIdentifier(Names.mimeType),
                referenceOf(data.operation, 'openapi/request-body-validator'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  return [mimeType, body]
}
