import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { resolveReference } from './resolveReference'
import { ReadContext, ReadInput } from './internalTypings'

export async function resolveReferenceable<T>(
  input: ReadInput<ReferenceObject | T>,
  context: ReadContext,
  resolveTarget: (input: ReadInput<T>, context: ReadContext) => Promise<void>,
): Promise<void> {
  if (!isReferenceObject(input.data)) {
    return await resolveTarget(input as ReadInput<T>, context)
  }
  if (!context.uriToObject.has(input.uri)) {
    return await resolveTarget(await resolveReference(input as ReadInput<ReferenceObject>, context), context)
  }
}
