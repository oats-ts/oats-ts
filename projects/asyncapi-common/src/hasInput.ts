import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { hasPathParams } from './hasPathParams'
import { hasQueryParams } from './hasQueryParams'
import { AsyncAPIGeneratorContext } from './typings'

export function hasInput(data: ChannelItemObject, context: AsyncAPIGeneratorContext): boolean {
  return hasQueryParams(data, context) || hasPathParams(data, context)
}
