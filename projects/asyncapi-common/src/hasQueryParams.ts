import { isNil, keys } from 'lodash'
import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext } from './typings'

export function hasQueryParams(channel: ChannelItemObject, context: AsyncAPIGeneratorContext): boolean {
  const { dereference } = context
  if (isNil(channel?.bindings?.ws?.query)) {
    return false
  }
  const { query: _query } = channel?.bindings?.ws
  const query = dereference(_query)
  return keys(query.properties || {}).length > 0
}
