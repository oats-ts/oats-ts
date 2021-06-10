import { ContentObject } from 'openapi3-ts'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import entries from 'lodash/entries'
import { resolveMediaTypeObject } from './resolveMediaTypeObject'
import { recordOfObjects } from './validators/recordOfObjects'

export async function resolveContentObject(input: ReadInput<ContentObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, recordOfObjects)) {
    return
  }
  const { data, uri } = input

  for (const [name, mediaTypeObj] of entries(data)) {
    await resolveMediaTypeObject({ data: mediaTypeObj, uri: context.uri.append(uri, name) }, context)
  }

  register(input, context)
}
