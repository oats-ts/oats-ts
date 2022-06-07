import { PathsObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { pathsObject } from './validators/pathsObject'
import { resolvePathItemObject } from './resolvePathItemObject'
import { entries } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolvePaths(input: ReadInput<PathsObject>, context: ReadContext): Try<PathsObject> {
  const validationResult = validate(input, context, pathsObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input ?? {}
  const parts: Try<any>[] = []

  // TODO wtf is $ref on pathItemObject
  for (const [path, pathItem] of entries(data)) {
    parts.push(resolvePathItemObject({ data: pathItem, uri: context.uri.append(uri, path) }, context))
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
