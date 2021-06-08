import { ReferenceObject, isReferenceObject } from 'openapi3-ts'
import { resolveReference } from './resolveReference'
import { ReadContext, ReadInput } from './internalTypings'

export async function resolveReferenceable<T>(
  input: ReadInput<ReferenceObject | T>,
  context: ReadContext,
  resolveTarget: (input: ReadInput<T>, context: ReadContext) => Promise<void>,
): Promise<void> {
  if (!isReferenceObject(input.data)) {
    await resolveTarget(input as ReadInput<T>, context)
  }
  if (!context.byUri.has(input.uri)) {
    await resolveTarget(await resolveReference(input as ReadInput<ReferenceObject>, context), context)
  }
}
