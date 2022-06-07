import { ParameterObject, PathItemObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveParameterObject } from './resolveParameterObject'
import { resolveOperation } from './resolveOperation'
import { pathItemObject } from './validators/pathItemObject'
import { entries, isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolvePathItemObject(input: ReadInput<PathItemObject>, context: ReadContext): Try<PathItemObject> {
  const validationResult = validate(input, context, pathItemObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { get, post, put, delete: _delete, head, patch, options, trace, parameters } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(get)) {
    parts.push(resolveOperation({ data: get, uri: context.uri.append(uri, 'get') }, context))
  }
  if (!isNil(post)) {
    parts.push(resolveOperation({ data: post, uri: context.uri.append(uri, 'post') }, context))
  }
  if (!isNil(put)) {
    parts.push(resolveOperation({ data: put, uri: context.uri.append(uri, 'put') }, context))
  }
  if (!isNil(_delete)) {
    parts.push(resolveOperation({ data: _delete, uri: context.uri.append(uri, 'delete') }, context))
  }
  if (!isNil(head)) {
    parts.push(resolveOperation({ data: head, uri: context.uri.append(uri, 'head') }, context))
  }
  if (!isNil(patch)) {
    parts.push(resolveOperation({ data: patch, uri: context.uri.append(uri, 'patch') }, context))
  }
  if (!isNil(options)) {
    parts.push(resolveOperation({ data: options, uri: context.uri.append(uri, 'options') }, context))
  }
  if (!isNil(trace)) {
    parts.push(resolveOperation({ data: trace, uri: context.uri.append(uri, 'trace') }, context))
  }
  if (!isNil(parameters)) {
    const parametersUri = context.uri.append(uri, 'parameters')
    register({ data: parameters, uri: parametersUri }, context)
    for (const [name, paramOrRef] of entries(parameters)) {
      parts.push(
        context.ref.resolveReferenceable<ParameterObject>(
          { data: paramOrRef, uri: context.uri.append(parametersUri, name) },
          context,
          resolveParameterObject,
        ),
      )
    }
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
