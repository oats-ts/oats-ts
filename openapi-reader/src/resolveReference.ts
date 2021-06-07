import { ReferenceObject } from 'openapi3-ts'
import { ReadContext, ReadInput } from './types'
import { isNil } from '../../utils'
import { findByFragments } from '../findByFragments'
import { register } from './register'
import { validate } from './validate'
import { Severity } from '@oats-ts/validators'

export function getReferenceTarget<T>(uri: string, context: ReadContext): T {
  const specUri = context.uri.document(uri)
  const spec = context.documents.get(specUri)

  if (isNil(spec)) {
    context.issues.push({
      message: `Spec "${specUri}" is not yet loaded.`,
      path: specUri,
      severity: Severity.ERROR,
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
      severity: Severity.ERROR,
    })
    return null
  }
}

export async function resolveReferenceUri<T>(input: ReadInput<string>, context: ReadContext): Promise<ReadInput<T>> {
  const { data, uri } = input
  const fullUri = context.uri.resolve(data, uri)
  const specUri = context.uri.document(fullUri)

  if (!context.documents.has(specUri)) {
    try {
      const spec = await context.resolve(specUri)
      context.documents.set(specUri, spec)
      return { uri: fullUri, data: getReferenceTarget<T>(fullUri, context) }
    } catch (e) {
      console.log(e)
      context.issues.push({
        path: specUri,
        message: `Failed to load document at "${specUri}".`,
        severity: Severity.ERROR,
      })
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

  return resolveReferenceUri(
    {
      data: data.$ref,
      uri: context.uri.append(uri, '$ref'),
    },
    context,
  )
}
