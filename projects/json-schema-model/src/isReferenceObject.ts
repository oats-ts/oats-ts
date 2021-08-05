import { ReferenceObject } from './types'

export function isReferenceObject(input: any): input is ReferenceObject {
  return input !== null && typeof input === 'object' && typeof input.$ref === 'string'
}
