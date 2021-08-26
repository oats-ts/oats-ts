import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { entries } from 'lodash'
import { safeName } from '@oats-ts/typescript-common'

export function getPathParamsTypeAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
) {
  const { nameOf, referenceOf, dereference } = context
  const { channel } = data
  const { parameters } = channel
  const typeLiteral = factory.createTypeLiteralNode(
    entries(parameters).map(([name, paramOrRef]): PropertySignature => {
      const param = dereference(paramOrRef, true)
      return factory.createPropertySignature([], safeName(name), undefined, referenceOf(param.schema, 'asyncapi/type'))
    }),
  )

  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(data.channel, 'asyncapi/path-type'),
    [],
    typeLiteral,
  )
}
