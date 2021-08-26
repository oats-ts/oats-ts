import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages } from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { hasPathParams } from '../factory/hasPathParams'
import { hasQueryParams } from '../factory/hasQueryParams'
import { negate, isNil } from 'lodash'

export function getInputTypeAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeAliasDeclaration {
  const { nameOf, referenceOf } = context
  const hasPath = hasPathParams(data.channel, context)
  const hasQuery = hasQueryParams(data.channel, context)

  const pathProp = hasPath
    ? factory.createPropertySignature(
        [],
        'path',
        undefined,
        factory.createTypeReferenceNode(referenceOf(data.channel, 'asyncapi/path-type')),
      )
    : undefined

  const queryProp = hasQuery
    ? factory.createPropertySignature(
        [],
        'query',
        undefined,
        factory.createTypeReferenceNode(referenceOf(data.channel, 'asyncapi/query-type')),
      )
    : undefined

  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(data.channel, 'asyncapi/input-type'),
    [],
    factory.createTypeLiteralNode([pathProp, queryProp].filter(negate(isNil))),
  )
}
