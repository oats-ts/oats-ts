import {
  AsyncAPIGeneratorContext,
  EnhancedChannel,
  RuntimePackages,
  hasPathParams,
  hasQueryParams,
} from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { Expression, factory } from 'typescript'

function getPathUrlExpression(data: EnhancedChannel, context: AsyncAPIGeneratorContext): Expression {
  const { referenceOf } = context
  return factory.createCallExpression(
    referenceOf(data.channel, 'asyncapi/path-serializer'),
    [],
    [factory.createPropertyAccessExpression(factory.createIdentifier('input'), 'path')],
  )
}

function getQueryUrlExpression(data: EnhancedChannel, context: AsyncAPIGeneratorContext): Expression {
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Param.serializeQuery),
    [],
    [factory.createPropertyAccessExpression(factory.createIdentifier('input'), 'query')],
  )
}

export function getUrlAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): Expression {
  const hasPath = hasPathParams(data.channel, context)
  const hasQuery = hasQueryParams(data.channel, context)
  const rawUrlExpr = factory.createStringLiteral(data.url)
  if (!hasPath && !hasQuery) {
    return rawUrlExpr
  }
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Param.joinUrl),
    [],
    [
      factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'baseUrl'),
      hasPath ? getPathUrlExpression(data, context) : rawUrlExpr,
      ...(hasQuery ? [getQueryUrlExpression(data, context)] : []),
    ],
  )
}
