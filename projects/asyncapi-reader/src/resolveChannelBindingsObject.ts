import { ChannelBindingsObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { isNil } from 'lodash'
import { channelBindingsObject } from './validators/channelBindingsObject'
import { resolveWebSocketsChannelBinding } from './resolveWebSocketsChannelBinding'

export async function resolveChannelBindingsObject(
  input: ReadInput<ChannelBindingsObject>,
  context: ReadContext,
): Promise<void> {
  if (!validate(input, context, channelBindingsObject)) {
    return
  }
  const { data, uri } = input
  const { ws } = data

  if (!isNil(ws)) {
    await resolveWebSocketsChannelBinding({ data: ws, uri: context.uri.append(uri, 'ws') }, context)
  }

  // TODO handle the reset if needed

  register(input, context)
}
