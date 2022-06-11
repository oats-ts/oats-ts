import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { factory, NodeFlags, SyntaxKind, VariableStatement } from 'typescript'
import { getParameterSerializerFactoryCall } from './getParameterSerializerFactoryCall'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'

export function getParameterSerializerConstant(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  target: OpenAPIGeneratorTarget,
): VariableStatement {
  const { nameOf, referenceOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(data.operation, target),
          undefined,
          undefined,
          getParameterSerializerFactoryCall(
            location,
            data,
            data[location],
            referenceOf(data.operation, getParameterTypeGeneratorTarget(location)),
            context,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
