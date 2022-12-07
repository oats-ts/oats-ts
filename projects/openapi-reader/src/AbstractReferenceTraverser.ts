import { Referenceable, ReferenceObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { Failure, failure, isSuccess, success, Try } from '@oats-ts/try'
import { ReadContext, ReferenceTraverser, TargetTraverser } from './typings'
import { register } from './utils/register'
import { isReferenceObject } from '@oats-ts/openapi-common'

export abstract class AbstractReferenceTraverser implements ReferenceTraverser {
  constructor(protected readonly context: ReadContext) {}

  abstract traverseReference(uri: string, fromUri: string): Try<string>

  protected resolveReference(data: ReferenceObject, uri: string): Try<ReferenceObject> {
    register(data, uri, this.context)
    if (!isNil(data)) {
      data.$ref = this.context.uri.resolve(data.$ref, uri)
    }
    const result = this.traverseReference(data?.$ref, this.context.uri.append(uri, '$ref'))
    return isSuccess(result) ? success(data) : result
  }

  public traverseReferenceable<T>(
    data: Referenceable<T>,
    uri: string,
    resolveTarget: TargetTraverser<T>,
  ): Try<Referenceable<T>> {
    if (!isReferenceObject(data)) {
      return resolveTarget(data, uri)
    }
    if (!this.context.cache.uriToObject.has(uri)) {
      return this.resolveReference(data, uri)
    }
    return success(data)
  }

  protected unresolvedDocumentFailure(specUri: string): Failure {
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
}
