import { factory, ParameterDeclaration } from 'typescript'
import { EnhancedChannel, hasInput } from '@oats-ts/asyncapi-common'
import { RuntimePackages, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'

export function getApiMethodParameterAsts(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
): ParameterDeclaration[] {
  const { nameOf } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data.channel, context)) {
    parameters.unshift(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(nameOf(data.channel, 'asyncapi/input-type')),
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
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(RuntimePackages.Ws.WebsocketConfig)]),
      factory.createObjectLiteralExpression([]),
    ),
  )

  return parameters
}
