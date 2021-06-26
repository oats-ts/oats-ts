import { record, object, string } from '@oats-ts/validators'

export const pathsObject = object(record(string(), object()))
