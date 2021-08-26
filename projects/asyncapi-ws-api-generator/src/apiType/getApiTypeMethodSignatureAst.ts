import { EnhancedChannel, hasInput, AsyncAPIGeneratorContext, RuntimePackages } from '@oats-ts/asyncapi-common'
import { factory, MethodSignature, ParameterDeclaration, SyntaxKind } from 'typescript'
import { ApiGeneratorConfig } from '../types'
import { documentNode } from '@oats-ts/typescript-common'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'

export function getApiTypeMethodSignatureAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): MethodSignature {
  const { nameOf } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data.channel, context)) {
    parameters.push(
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
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(RuntimePackages.Ws.WebsocketConfig)]),
    ),
  )

  const returnType = getApiMethodReturnTypeAst(data, context)

  const node = factory.createMethodSignature(
    [],
    nameOf(data.channel, 'asyncapi/channel-factory'),
    undefined,
    [],
    parameters,
    returnType,
  )

  return config.documentation ? documentNode(node, data.channel) : node
}
