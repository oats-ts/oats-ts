import { Referenceable, ReferenceObject } from '@oats-ts/json-schema-model'
import { ReadContext } from './internalTypings'
import { isNil } from 'lodash'
import { isSuccess, success, Try } from '@oats-ts/try'
import { isReferenceObject } from '@oats-ts/model-common'
import { ReferenceResolver, TargetResolver } from './typings'
import { register } from './register'

export abstract class AbstractRefResolver implements ReferenceResolver {
  constructor(protected readonly context: ReadContext) {}

  abstract resolveReferenceUri(refUri: string, uri: string): Try<string>

  protected resolveReference(data: ReferenceObject, uri: string): Try<ReferenceObject> {
    register(data, uri, this.context)
    if (!isNil(data)) {
      data.$ref = this.context.uri.resolve(data.$ref, uri)
    }
    const result = this.resolveReferenceUri(data?.$ref, this.context.uri.append(uri, '$ref'))
    return isSuccess(result) ? success(data) : result
  }

  public resolveReferenceable<T>(
    data: Referenceable<T>,
    uri: string,
    resolveTarget: TargetResolver<T>,
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
