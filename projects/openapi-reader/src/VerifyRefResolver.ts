import { isNil } from 'lodash'
import { success, Try } from '@oats-ts/try'
import { findByFragments } from './findByFragments'
import { AbstractRefResolver } from './AbstractRefResolver'

export class VerifyRefResolver extends AbstractRefResolver {
  // TODO add tests for this
  public traverseReference(uri: string, _fromUri: string): Try<string> {
    const specUri = this.context.uri.document(uri)
    const spec = this.context.cache.documents.get(specUri)

    if (isNil(spec)) {
      return this.unresolvedDocumentFailure(specUri)
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
