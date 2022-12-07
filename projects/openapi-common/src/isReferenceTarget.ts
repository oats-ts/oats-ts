import { Referenceable } from '@oats-ts/json-schema-model'
import { isReferenceObject } from './isReferenceObject'

export function isReferenceTarget<T>(input: Referenceable<T>): input is T {
  return !isReferenceObject(input)
}
