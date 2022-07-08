import { RequestBodyObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveContentObject } from './resolveContentObject'
import { requestBodyObject } from './validators/requestBodyObject'
import { isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveRequestBodyObject(
  input: ReadInput<RequestBodyObject>,
  context: ReadContext,
): Try<RequestBodyObject> {
  const validationResult = validate(input, context, requestBodyObject)
  if (isFailure(validationResult)) {
    return validationResult
  }
  register(input, context)

  const { data, uri } = input
  const { content } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(content)) {
    parts.push(resolveContentObject({ data: content, uri: context.uri.append(uri, 'content') }, context))
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
