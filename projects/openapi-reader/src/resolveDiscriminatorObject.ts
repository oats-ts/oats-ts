import { DiscriminatorObject, SchemaObject } from '@oats-ts/json-schema-model'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { discriminatorObject } from './validators/discriminatorObject'
import { register } from './register'
import { entries, isNil } from 'lodash'
import { isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveDiscriminatorObject(
  input: ReadInput<DiscriminatorObject>,
  context: ReadContext,
): Try<DiscriminatorObject> {
  const validationResult = validate(input, context, discriminatorObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { mapping } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(mapping)) {
    for (const [key, ref] of entries(mapping)) {
      const refInput = context.ref.resolveReferenceUri(
        { data: ref, uri: context.uri.append(uri, 'mapping', key) },
        context,
      )
      parts.push(refInput)
      if (isSuccess(refInput)) {
        mapping[key] = refInput.data
      }
    }
  }
  return success(data)
}
