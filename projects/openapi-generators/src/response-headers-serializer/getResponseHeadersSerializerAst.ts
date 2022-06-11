import { getResponseHeaders, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { entries, values } from 'lodash'
import { factory, NodeFlags, PropertyAssignment, SyntaxKind } from 'typescript'
import { getParameterSerializerFactoryCall } from '../utils/serializers/getParameterSerializerFactoryCall'

export function getResponseHeadersSerializerAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const { nameOf, referenceOf } = context
  const headers = entries(getResponseHeaders(data.operation, context))
  const props = headers
    .filter(([, headers]) => values(headers).length > 0)
    .map(([status, headers]): PropertyAssignment => {
      return factory.createPropertyAssignment(
        status === 'default' ? factory.createStringLiteral(status) : factory.createNumericLiteral(status),
        getParameterSerializerFactoryCall(
          'header',
          data,
          values(headers),
          referenceOf([data.operation, status], 'openapi/response-headers-type'),
          context,
        ),
      )
    })

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(data.operation, 'openapi/response-headers-serializer'),
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
