import { ReferenceObject } from '@oats-ts/json-schema-model'

export function isReferenceObject(input: any): input is ReferenceObject {
  return input !== null && typeof input === 'object' && typeof input.$ref === 'string'
}
