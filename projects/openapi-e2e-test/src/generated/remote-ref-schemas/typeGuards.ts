/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/remote-ref-schemas.json (originating from oats-ts/oats-schemas)
 */

import { ReferenceTarget, TypeWithRemoteRefField } from './types'

export function isReferenceTarget(input: any): input is ReferenceTarget {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.referenceTarget === null || input.referenceTarget === undefined || input.referenceTarget === true)
  )
}

export function isTypeWithRemoteRefField(input: any): input is TypeWithRemoteRefField {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.referenceArrayField) &&
    input.referenceArrayField.every((item: any) => isReferenceTarget(item) as boolean) &&
    (isReferenceTarget(input.referenceField) as boolean)
  )
}
