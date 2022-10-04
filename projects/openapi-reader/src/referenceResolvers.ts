import { Referenceable, ReferenceObject } from '@oats-ts/json-schema-model'
import { ReadContext, ReadInput, ReferenceResolver } from './internalTypings'
import { register } from './register'
import { isNil } from 'lodash'
import { Failure, failure, isSuccess, Success, success, Try } from '@oats-ts/try'
import { isReferenceObject } from '@oats-ts/model-common'
import { findByFragments } from './findByFragments'

abstract class AbstractRefResolver implements ReferenceResolver {
  abstract resolveReferenceUri(input: ReadInput<string>, context: ReadContext): Try<string>

  protected resolveReference(input: ReadInput<ReferenceObject>, context: ReadContext): Try<ReferenceObject> {
    const { data, uri } = input
    register(input, context)
    if (!isNil(data)) {
      data.$ref = context.uri.resolve(data.$ref, uri)
    }
    const result = this.resolveReferenceUri(
      {
        data: data?.$ref,
        uri: context.uri.append(uri, '$ref'),
      },
      context,
    )
    return isSuccess(result) ? success(data) : result
  }

  resolveReferenceable<T>(
    input: ReadInput<Referenceable<T>>,
    context: ReadContext,
    resolveTarget: (input: ReadInput<T>, context: ReadContext) => Try<T>,
  ): Try<Referenceable<T>> {
    if (!isReferenceObject(input.data)) {
      return resolveTarget(input as ReadInput<T>, context)
    }
    if (!context.cache.uriToObject.has(input.uri)) {
      return this.resolveReference(input as ReadInput<ReferenceObject>, context)
    }
    return success(input.data)
  }
}

export class ReadRefResolver extends AbstractRefResolver {
  public resolveReferenceUri(input: ReadInput<string>, context: ReadContext): Success<string> {
    const { data, uri } = input
    const fullUri = context.uri.resolve(data!, uri)
    const documentUri = context.uri.document(fullUri)
    if (!context.cache.documents.has(documentUri)) {
      context.externalDocumentUris.add(documentUri)
    }
    return success(fullUri)
  }
}

export class VerifyRefResolver extends AbstractRefResolver {
  private noDocumentFailure(specUri: string): Failure {
    return failure({
      message: `document is not resolved`,
      path: specUri,
      severity: 'error',
    })
  }

  protected unresolveableRefFailure(uri: string, specUri: string, context: ReadContext): Failure {
    const fragment = `#${context.uri.fragments(uri).join('/')}`
    return failure({
      message: `can't resolve reference "${fragment}"`,
      path: specUri,
      severity: 'error',
    })
  }

  public resolveReferenceUri({ uri }: ReadInput<string>, context: ReadContext): Try<string> {
    const specUri = context.uri.document(uri)
    const spec = context.cache.documents.get(specUri)

    if (isNil(spec)) {
      return this.noDocumentFailure(specUri)
    }

    const fragments = context.uri.fragments(uri)

    try {
      const result = findByFragments(spec, fragments)
      return isNil(result) ? this.unresolveableRefFailure(uri, specUri, context) : success(uri)
    } catch (e) {
      return this.unresolveableRefFailure(uri, specUri, context)
    }
  }
}
