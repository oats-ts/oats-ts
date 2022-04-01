import { ReferenceObject } from '@oats-ts/json-schema-model'
import { ReadContext, ReadInput } from './internalTypings'
import { findByFragments } from './findByFragments'
import { register } from './register'
import { isNil } from 'lodash'
import { isReferenceObject } from '@oats-ts/model-common'
import { isFailure } from '@oats-ts/try'

export function getReferenceTarget<T>(uri: string, context: ReadContext): T {
  const specUri = context.uri.document(uri)
  const spec = context.documents.get(specUri)

  if (isNil(spec)) {
    context.issues.push({
      message: `Document "${specUri}" is not yet loaded.`,
      path: specUri,
      severity: 'error',
      type: 'load',
    })
    return null
  }

  const fragments = context.uri.fragments(uri)

  try {
    return findByFragments(spec, fragments)
  } catch (e) {
    context.issues.push({
      message: `Can't resolve "${uri}"`,
      path: specUri,
      severity: 'error',
      type: 'load',
    })
    return null
  }
}

export async function resolveReferenceUri<T>(input: ReadInput<string>, context: ReadContext): Promise<ReadInput<T>> {
  const { data, uri } = input
  const fullUri = context.uri.resolve(data, uri)
  const specUri = context.uri.document(fullUri)

  if (!context.documents.has(specUri)) {
    const specTry = await context.resolve(specUri)
    if (isFailure(specTry)) {
      context.issues.push(...specTry.issues)
      return { uri: fullUri, data: getReferenceTarget<T>(fullUri, context) }
    } else {
      context.documents.set(specUri, specTry.data)
    }
  }

  return { uri: fullUri, data: getReferenceTarget<T>(fullUri, context) }
}

export async function resolveReference<T>(
  input: ReadInput<ReferenceObject>,
  context: ReadContext,
): Promise<ReadInput<T>> {
  const { data, uri } = input

  register(input, context)

  data.$ref = context.uri.resolve(data.$ref, uri)

  const result = await resolveReferenceUri<ReferenceObject | T>(
    {
      data: data.$ref,
      uri: context.uri.append(uri, '$ref'),
    },
    context,
  )

  if (isReferenceObject(result.data) && !context.uriToObject.has(result.data.$ref)) {
    return resolveReference(result as ReadInput<ReferenceObject>, context)
  }

  return result as ReadInput<T>
}
