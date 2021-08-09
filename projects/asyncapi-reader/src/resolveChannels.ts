import { ChannelsObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveChannelItemObject } from './resolveChannelItemObject'
import { entries } from 'lodash'
import { recordOfObjects } from './validators/recordOfObjects'
import { resolveReferenceable } from './resolveReferenceable'

export async function resolveChannels(input: ReadInput<ChannelsObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, recordOfObjects)) {
    return
  }

  register(input, context)

  const { data, uri } = input

  for (const [path, pathItem] of entries(data)) {
    await resolveReferenceable({ data: pathItem, uri: context.uri.append(uri, path) }, context, resolveChannelItemObject)
  }
}
