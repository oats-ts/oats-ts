import {
  AsyncAPIGeneratorContext,
  EnhancedChannel,
  RuntimePackages,
  hasPathParams,
  hasQueryParams,
} from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { FunctionDeclaration, factory, SyntaxKind, ParameterDeclaration } from 'typescript'
import { getChannelFactoryReturnAst } from './getChannelFactoryReturnAst'
import { documentNode } from '@oats-ts/typescript-common'

export function getChannelFactoryAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): FunctionDeclaration {
  const { nameOf, referenceOf } = context
  const { channel } = data
  const hasPath = hasPathParams(data.channel, context)
  const hasQuery = hasQueryParams(data.channel, context)

  const parameters: ParameterDeclaration[] = [
    ...(hasPath || hasQuery
      ? [
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            'input',
            undefined,
            referenceOf(channel, 'asyncapi/input-type'),
          ),
        ]
      : []),
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      'config',
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Ws.WebsocketConfig),
    ),
  ]

  const node = factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    nameOf(channel, 'asyncapi/channel-factory'),
    [],
    parameters,
    referenceOf(channel, 'asyncapi/channel'),
    factory.createBlock([factory.createReturnStatement(getChannelFactoryReturnAst(data, context, config))]),
  )
  return config.documentation ? documentNode(node, channel) : node
}
