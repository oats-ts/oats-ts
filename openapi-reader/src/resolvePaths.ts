import { OperationObject, PathsObject } from 'openapi3-ts'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { pathsObject } from './validators/pathsObject'
import { resolvePathItemObject } from './resolvePathItemObject'
import { entries } from 'lodash'

export async function resolvePaths(input: ReadInput<PathsObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, pathsObject)) {
    return
  }

  const { data, uri } = input

  // TODO wtf is $ref on pathItemObject
  for (const [path, pathItem] of entries(data)) {
    await resolvePathItemObject({ data: pathItem, uri: context.uri.append(uri, path) }, context)
  }

  register(input, context)
}
