import { MessageObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveReferenceable } from './resolveReferenceable'
import { isNil } from 'lodash'
import { messageObject } from './validators/messageObject'
import { resolveSchemaObject } from './resolveSchemaObject'

export async function resolveMessageObject(input: ReadInput<MessageObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, messageObject)) {
    return
  }
  const { data, uri } = input
  const { payload, traits } = data

  if (!isNil(payload)) {
    await resolveReferenceable({ data: payload, uri: context.uri.append(uri, 'payload') }, context, resolveSchemaObject)
  }
  if (!isNil(traits)) {
    const traitsUri = context.uri.append(uri, 'traits')
    register({ data: traits, uri: traitsUri }, context)
    for (let i = 0; i < traits.length; i += 1) {
      const trait = traits[i]
      register({ data: trait, uri: context.uri.append(traitsUri, i.toString()) }, context)
      // TODO write custom resolver if needed
    }
  }

  register(input, context)
}
