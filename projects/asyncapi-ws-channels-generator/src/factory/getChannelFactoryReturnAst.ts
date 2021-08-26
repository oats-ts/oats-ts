import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, CallExpression } from 'typescript'
import { getUrlAst } from './getUrlAst'

export function getChannelFactoryReturnAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): CallExpression {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'adapter'),
    [],
    [getUrlAst(data, context, config), factory.createIdentifier('config')],
  )
}
