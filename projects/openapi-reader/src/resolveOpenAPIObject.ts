import { OpenAPIObject } from '@oats-ts/openapi-model'
import { ReadContext, ReadInput } from './internalTypings'
import { resolveComponents } from './resolveComponents'
import { resolvePaths } from './resolvePaths'
import { validate } from './validate'
import { openApiObject } from './validators/openApiObject'
import { register } from './register'
import { isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveOpenAPIObject(input: ReadInput<OpenAPIObject>, context: ReadContext): Try<OpenAPIObject> {
  const validationResult = validate(input, context, openApiObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { paths, components } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(paths)) {
    parts.push(resolvePaths({ data: paths, uri: context.uri.append(uri, 'paths') }, context))
  }
  if (!isNil(components)) {
    parts.push(resolveComponents({ data: components, uri: context.uri.append(uri, 'components') }, context))
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
