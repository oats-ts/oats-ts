import { MediaTypeObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { resolveSchemaObject } from './resolveSchemaObject'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { mediaTypeObject } from './validators/mediaTypeObject'
import { isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveMediaTypeObject(input: ReadInput<MediaTypeObject>, context: ReadContext): Try<MediaTypeObject> {
  const validationResult = validate(input, context, mediaTypeObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { schema, encoding } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(schema)) {
    parts.push(
      context.ref.resolveReferenceable(
        { data: schema, uri: context.uri.append(uri, 'schema') },
        context,
        resolveSchemaObject,
      ),
    )
  }

  if (!isNil(encoding)) {
    // TODO not dealing with this mess for now...
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
