import { HeaderObject, ResponseObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveHeaderObject } from './resolveParameterObject'
import { responseObject } from './validators/responseObject'
import { resolveContentObject } from './resolveContentObject'
import { entries, isNil } from 'lodash'
import { registerNamed } from './registerNamed'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveResponseObject(input: ReadInput<ResponseObject>, context: ReadContext): Try<ResponseObject> {
  const validationResult = validate(input, context, responseObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { content, headers } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(headers)) {
    for (const [name, headerOrRef] of entries(headers)) {
      parts.push(
        context.ref.resolveReferenceable<HeaderObject>(
          { data: headerOrRef, uri: context.uri.append(uri, 'headers', name) },
          context,
          resolveHeaderObject,
        ),
      )
      registerNamed(name, headerOrRef, context)
    }
  }

  if (!isNil(content)) {
    parts.push(resolveContentObject({ data: content, uri: context.uri.append(uri, 'content') }, context))
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
