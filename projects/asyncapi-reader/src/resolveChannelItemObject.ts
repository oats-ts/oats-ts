import { ChannelItemObject, ParameterObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveParameterObject } from './resolveParameterObject'
import { resolveOperation } from './resolveOperation'
import { entries, isNil } from 'lodash'
import { channelItemObject } from './validators/channelItemObject'
import { resolveChannelBindingsObject } from './resolveChannelBindingsObject'

export async function resolveChannelItemObject(
  input: ReadInput<ChannelItemObject>,
  context: ReadContext,
): Promise<void> {
  if (!validate(input, context, channelItemObject)) {
    return
  }
  const { data, uri } = input
  const { parameters, bindings, publish, subscribe } = data

  if (!isNil(publish)) {
    await resolveOperation({ data: publish, uri: context.uri.append(uri, 'publish') }, context)
  }
  if (!isNil(subscribe)) {
    await resolveOperation({ data: subscribe, uri: context.uri.append(uri, 'subscribe') }, context)
  }
  if (!isNil(bindings)) {
    await resolveChannelBindingsObject({ data: bindings, uri: context.uri.append(uri, 'bindings') }, context)
  }
  if (!isNil(parameters)) {
    for (const [name, paramOrRef] of entries(parameters)) {
      await resolveReferenceable<ParameterObject>(
        { data: paramOrRef, uri: context.uri.append(uri, 'parameters', name) },
        context,
        resolveParameterObject,
      )
    }
  }

  register(input, context)
}
