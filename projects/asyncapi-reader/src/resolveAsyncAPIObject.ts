import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { ReadContext, ReadInput } from './internalTypings'
import { resolveComponents } from './resolveComponents'
import { resolveChannels } from './resolveChannels'
import { validate } from './validate'
import { asyncApiObject } from './validators/asyncApiObject'
import { register } from './register'
import { isNil } from 'lodash'

export async function resolveOpenAPIObject(input: ReadInput<AsyncApiObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, asyncApiObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { channels, components } = data

  if (!isNil(channels)) {
    await resolveChannels({ data: channels, uri: context.uri.append(uri, 'channels') }, context)
  }
  if (!isNil(components)) {
    await resolveComponents({ data: components, uri: context.uri.append(uri, 'components') }, context)
  }
}
