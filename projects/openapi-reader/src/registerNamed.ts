import { ReferenceObject, isReferenceObject } from 'openapi3-ts'
import { ReadContext } from './internalTypings'
import { isNil } from 'lodash'

export function registerNamed<T>(name: string, input: T | ReferenceObject, context: ReadContext): void {
  context.objectToName.set(input, name)
  if (isReferenceObject(input)) {
    const item = context.uriToObject.get(input.$ref)
    if (isNil(item)) {
      context.objectToName.set(input, name)
    }
  }
}
