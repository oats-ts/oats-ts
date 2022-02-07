import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { entries } from 'lodash'
import { safeName, documentNode } from '@oats-ts/typescript-common'

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
      const property = factory.createPropertySignature(
        [],
        safeName(name),
        undefined,
        referenceOf(param.schema, 'json-schema/type'),
      )
      return config.documentation ? documentNode(property, param) : property
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
