import { OperationObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { operationObject } from './validators/operationObject'
import { resolveReferenceable } from './resolveReferenceable'
import { isNil } from 'lodash'
import { resolveMessageObject } from './resolveMessageObject'

export async function resolveOperation(input: ReadInput<OperationObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, operationObject)) {
    return
  }
  const { data, uri } = input
  const { message, traits } = data

  if (!isNil(message)) {
    await resolveReferenceable(
      { data: message, uri: context.uri.append(uri, 'message') },
      context,
      resolveMessageObject,
    )
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
