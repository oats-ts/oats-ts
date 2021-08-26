import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages } from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, NodeFlags, SyntaxKind } from 'typescript'

export function getPathSerializerAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
) {
  const { nameOf } = context
  const { channel, url } = data

  const fnCall = factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Param.createPathSerializer),
    [],
    [factory.createStringLiteral(url)],
  )

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(nameOf(channel, 'asyncapi/path-serializer'), undefined, undefined, fnCall)],
      NodeFlags.Const,
    ),
  )
}
