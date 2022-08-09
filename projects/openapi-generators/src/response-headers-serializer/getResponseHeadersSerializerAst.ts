import { getResponseHeaders, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { entries, values } from 'lodash'
import { factory, NodeFlags, PropertyAssignment, SyntaxKind } from 'typescript'
import { getDslObjectAst } from '../utils/dsl/getDslObjectAst'

export function getResponseHeadersSerializerAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const headers = entries(getResponseHeaders(data.operation, context))
  const props = headers
    .filter(([, headers]) => values(headers).length > 0)
    .map(([status, headers]): PropertyAssignment => {
      return factory.createPropertyAssignment(
        status === 'default' ? factory.createStringLiteral(status) : factory.createNumericLiteral(status),
        factory.createCallExpression(
          factory.createIdentifier(RuntimePackages.ParameterSerialization.createHeaderSerializer),
          [context.referenceOf([data.operation, status], 'oats/response-headers-type')],
          [getDslObjectAst(values(headers), context)],
        ),
      )
    })

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          context.nameOf(data.operation, 'oats/response-headers-serializer'),
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createObjectLiteralExpression(props),
            factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
