import { NamedComplexObject } from '../types/NamedComplexObject'
import { isNamedEnum } from './isNamedEnum'
import { isNamedRecord } from './isNamedRecord'

export function isNamedComplexObject(input: any): input is NamedComplexObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.enumProperty === null ||
      input.enumProperty === undefined ||
      input.enumProperty === 'Racoon' ||
      input.enumProperty === 'Dog' ||
      input.enumProperty === 'Cat') &&
    (input.enumReferenceProperty === null ||
      input.enumReferenceProperty === undefined ||
      isNamedEnum(input.enumReferenceProperty)) &&
    (input['non-identifier * property}'] === null ||
      input['non-identifier * property}'] === undefined ||
      typeof input['non-identifier * property}'] === 'string') &&
    (input.recordProperty === null ||
      input.recordProperty === undefined ||
      (input.recordProperty !== null &&
        typeof input.recordProperty === 'object' &&
        Object.keys(input.recordProperty).every((key) => typeof input.recordProperty[key] === 'boolean'))) &&
    (input.referenceArrayProperty === null ||
      input.referenceArrayProperty === undefined ||
      (Array.isArray(input.referenceArrayProperty) &&
        input.referenceArrayProperty.every((item: any) => isNamedRecord(item)))) &&
    (input.referenceProperty === null ||
      input.referenceProperty === undefined ||
      isNamedRecord(input.referenceProperty)) &&
    (input.stringArrayProperty === null ||
      input.stringArrayProperty === undefined ||
      (Array.isArray(input.stringArrayProperty) &&
        input.stringArrayProperty.every((item: any) => typeof item === 'string')))
  )
}
