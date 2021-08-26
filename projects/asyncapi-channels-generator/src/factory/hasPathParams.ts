import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { isNil, keys } from 'lodash'
import { ChannelItemObject } from '@oats-ts/asyncapi-model'

export function hasPathParams(data: ChannelItemObject, context: AsyncAPIGeneratorContext): boolean {
  return !isNil(data.parameters) && keys(data.parameters).length > 0
}
