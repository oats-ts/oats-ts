import { object, record, string } from '@oats-ts/validators'

export const recordOfObjects = object(record(string(), object()))
