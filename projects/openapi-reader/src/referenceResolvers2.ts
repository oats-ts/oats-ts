import { Referenceable, ReferenceObject } from '@oats-ts/json-schema-model'
import { ReadContext } from './internalTypings'
import { isNil } from 'lodash'
import { Failure, failure, isSuccess, Success, success, Try } from '@oats-ts/try'
import { isReferenceObject } from '@oats-ts/model-common'
import { findByFragments } from './findByFragments'
import { ReferenceResolver2 } from './typings'
import { register2 } from './register2'

abstract class AbstractRefResolver implements ReferenceResolver2 {
  constructor(protected readonly context: ReadContext) {}

  abstract resolveReferenceUri(refUri: string, uri: string): Try<string>

  protected resolveReference(data: ReferenceObject, uri: string): Try<ReferenceObject> {
    register2(data, uri, this.context)
    if (!isNil(data)) {
      data.$ref = this.context.uri.resolve(data.$ref, uri)
    }
    const result = this.resolveReferenceUri(data?.$ref, this.context.uri.append(uri, '$ref'))
    return isSuccess(result) ? success(data) : result
  }

  public resolveReferenceable<T>(
    data: Referenceable<T>,
    uri: string,
    resolveTarget: (data: T, uri: string) => Try<T>,
  ): Try<Referenceable<T>> {
    if (!isReferenceObject(data)) {
      return resolveTarget(data, uri)
    }
    if (!this.context.cache.uriToObject.has(uri)) {
      return this.resolveReference(data, uri)
    }
    return success(data)
  }
}

export class ReadRefResolver extends AbstractRefResolver {
  public resolveReferenceUri(data: string, uri: string): Success<string> {
    const fullUri = this.context.uri.resolve(data!, uri)
    const documentUri = this.context.uri.document(fullUri)
    if (!this.context.cache.documents.has(documentUri)) {
      this.context.externalDocumentUris.add(documentUri)
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

  protected unresolveableRefFailure(uri: string, specUri: string): Failure {
    const fragment = `#${this.context.uri.fragments(uri).join('/')}`
    return failure({
      message: `can't resolve reference "${fragment}"`,
      path: specUri,
      severity: 'error',
    })
  }

  public resolveReferenceUri(_: string, uri: string): Try<string> {
    const specUri = this.context.uri.document(uri)
    const spec = this.context.cache.documents.get(specUri)

    if (isNil(spec)) {
      return this.noDocumentFailure(specUri)
    }

    const fragments = this.context.uri.fragments(uri)

    try {
      const result = findByFragments(spec, fragments)
      return isNil(result) ? this.unresolveableRefFailure(uri, specUri) : success(uri)
    } catch (e) {
      return this.unresolveableRefFailure(uri, specUri)
    }
  }
}
