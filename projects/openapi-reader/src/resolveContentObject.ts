import { ContentObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveMediaTypeObject } from './resolveMediaTypeObject'
import { recordOfObjects } from './validators/recordOfObjects'
import { entries } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveContentObject(input: ReadInput<ContentObject>, context: ReadContext): Try<ContentObject> {
  const validationResult = validate(input, context, recordOfObjects)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const parts: Try<any>[] = []

  for (const [name, mediaTypeObj] of entries(data)) {
    parts.push(resolveMediaTypeObject({ data: mediaTypeObj, uri: context.uri.append(uri, name) }, context))
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data!) : merged
}
