import { number, object, record, string } from '@oats-ts/validators'

export const namedRecordValidator = object(record(string(), number()))
