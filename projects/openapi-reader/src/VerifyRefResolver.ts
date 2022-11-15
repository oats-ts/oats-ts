import { isNil } from 'lodash'
import { Failure, failure, success, Try } from '@oats-ts/try'
import { findByFragments } from './findByFragments'
import { AbstractRefResolver } from './AbstractRefResolver'

export class VerifyRefResolver extends AbstractRefResolver {
  protected noDocumentFailure(specUri: string): Failure {
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
