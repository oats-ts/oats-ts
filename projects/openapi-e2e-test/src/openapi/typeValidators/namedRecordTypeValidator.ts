import { number, object, record, string } from '@oats-ts/validators'

export const namedRecordTypeValidator = object(record(string(), number()))
