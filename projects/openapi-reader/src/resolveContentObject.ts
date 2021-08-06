import { ContentObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveMediaTypeObject } from './resolveMediaTypeObject'
import { recordOfObjects } from './validators/recordOfObjects'
import { entries } from 'lodash'

export async function resolveContentObject(input: ReadInput<ContentObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, recordOfObjects)) {
    return
  }

  register(input, context)

  const { data, uri } = input

  for (const [name, mediaTypeObj] of entries(data)) {
    await resolveMediaTypeObject({ data: mediaTypeObj, uri: context.uri.append(uri, name) }, context)
  }
}
