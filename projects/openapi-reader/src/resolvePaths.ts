import { PathsObject } from '@oats-ts/openapi-model'
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

  register(input, context)

  const { data, uri } = input

  // TODO wtf is $ref on pathItemObject
  for (const [path, pathItem] of entries(data)) {
    await resolvePathItemObject({ data: pathItem, uri: context.uri.append(uri, path) }, context)
  }
}
