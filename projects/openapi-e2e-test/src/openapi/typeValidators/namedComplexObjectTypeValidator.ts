import { array, boolean, enumeration, items, lazy, object, optional, record, shape, string } from '@oats-ts/validators'
import { namedEnumTypeValidator } from './namedEnumTypeValidator'
import { namedRecordTypeValidator } from './namedRecordTypeValidator'

export const namedComplexObjectTypeValidator = object(
  shape({
    enumProperty: optional(enumeration(['Racoon', 'Dog', 'Cat'])),
    enumReferenceProperty: optional(lazy(() => namedEnumTypeValidator)),
    'non-identifier * property}': optional(string()),
    recordProperty: optional(object(record(string(), boolean()))),
    referenceArrayProperty: optional(array(items(lazy(() => namedRecordTypeValidator)))),
    referenceProperty: optional(lazy(() => namedRecordTypeValidator)),
    referenceRecordProperty: optional(
      object(
        record(
          string(),
          lazy(() => namedRecordTypeValidator),
        ),
      ),
    ),
    stringArrayProperty: optional(array(items(string()))),
  }),
)
