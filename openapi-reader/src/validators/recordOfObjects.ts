import { object, dictionaryOf } from '@oats-ts/validators'

export const recordOfObjects = object(dictionaryOf(object()))
