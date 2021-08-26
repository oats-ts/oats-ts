import { isNil, keys } from 'lodash'
import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext } from './typings'

export function hasPathParams(data: ChannelItemObject, context: AsyncAPIGeneratorContext): boolean {
  return !isNil(data.parameters) && keys(data.parameters).length > 0
}
