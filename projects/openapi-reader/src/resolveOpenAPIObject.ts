import { OpenAPIObject } from '@oats-ts/openapi-model'
import { ReadContext, ReadInput } from './internalTypings'
import { resolveComponents } from './resolveComponents'
import { resolvePaths } from './resolvePaths'
import { validate } from './validate'
import { openApiObject } from './validators/openApiObject'
import { register } from './register'
import { isNil } from 'lodash'

export async function resolveOpenAPIObject(input: ReadInput<OpenAPIObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, openApiObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { paths, components } = data

  if (!isNil(paths)) {
    await resolvePaths({ data: paths, uri: context.uri.append(uri, 'paths') }, context)
  }
  if (!isNil(components)) {
    await resolveComponents({ data: components, uri: context.uri.append(uri, 'components') }, context)
  }
}
