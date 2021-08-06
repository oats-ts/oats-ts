import { ParameterObject, PathItemObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveParameterObject } from './resolveParameterObject'
import { resolveOperation } from './resolveOperation'
import { pathItemObject } from './validators/pathItemObject'
import { entries, isNil } from 'lodash'

export async function resolvePathItemObject(input: ReadInput<PathItemObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, pathItemObject)) {
    return
  }
  const { data, uri } = input
  const { get, post, put, delete: _delete, head, patch, options, trace, parameters } = data

  if (!isNil(get)) {
    await resolveOperation({ data: get, uri: context.uri.append(uri, 'get') }, context)
  }
  if (!isNil(post)) {
    await resolveOperation({ data: post, uri: context.uri.append(uri, 'post') }, context)
  }
  if (!isNil(put)) {
    await resolveOperation({ data: put, uri: context.uri.append(uri, 'put') }, context)
  }
  if (!isNil(_delete)) {
    await resolveOperation({ data: _delete, uri: context.uri.append(uri, 'delete') }, context)
  }
  if (!isNil(head)) {
    await resolveOperation({ data: head, uri: context.uri.append(uri, 'head') }, context)
  }
  if (!isNil(patch)) {
    await resolveOperation({ data: patch, uri: context.uri.append(uri, 'patch') }, context)
  }
  if (!isNil(options)) {
    await resolveOperation({ data: options, uri: context.uri.append(uri, 'options') }, context)
  }
  if (!isNil(trace)) {
    await resolveOperation({ data: options, uri: context.uri.append(uri, 'options') }, context)
  }
  if (!isNil(parameters)) {
    for (const [name, paramOrRef] of entries(parameters)) {
      await resolveReferenceable<ParameterObject>(
        { data: paramOrRef, uri: context.uri.append(uri, 'parameters', name) },
        context,
        resolveParameterObject,
      )
    }
  }

  register(input, context)
}
