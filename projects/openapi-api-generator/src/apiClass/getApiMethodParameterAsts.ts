import { factory, ParameterDeclaration } from 'typescript'
import { hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getApiMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ParameterDeclaration[] {
  const { accessor } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data, context)) {
    parameters.unshift(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(accessor.name(data.operation, 'openapi/input-type')),
      ),
    )
  }

  parameters.push(
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      'config',
      undefined,
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(RuntimePackages.Http.RequestConfig)]),
      factory.createObjectLiteralExpression([]),
    ),
  )

  return parameters
}
