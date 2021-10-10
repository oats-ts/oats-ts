import { factory, ParameterDeclaration } from 'typescript'
import { hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getSdkMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  unused: boolean,
): ParameterDeclaration[] {
  const { nameOf } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data, context)) {
    parameters.unshift(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        unused ? '_input' : 'input',
        undefined,
        factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/request-type')),
      ),
    )
  }

  parameters.push(
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      unused ? '_config' : 'config',
      undefined,
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(RuntimePackages.Http.ClientConfiguration)]),
      factory.createObjectLiteralExpression([]),
    ),
  )

  return parameters
}
