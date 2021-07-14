import { array, boolean, enumeration, items, lazy, object, optional, record, shape, string } from '@oats-ts/validators'
import { namedEnumValidator } from './namedEnumValidator'
import { namedRecordValidator } from './namedRecordValidator'

export const namedComplexObjectValidator = object(
  shape({
    enumProperty: optional(enumeration(['Racoon', 'Dog', 'Cat'])),
    enumReferenceProperty: optional(lazy(() => namedEnumValidator)),
    'non-identifier * property}': optional(string()),
    recordProperty: optional(object(record(string(), boolean()))),
    referenceArrayProperty: optional(array(items(lazy(() => namedRecordValidator)))),
    referenceProperty: optional(lazy(() => namedRecordValidator)),
    stringArrayProperty: optional(array(items(string()))),
  }),
)
