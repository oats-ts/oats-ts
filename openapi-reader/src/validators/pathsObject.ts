import { dictionaryOf, object } from '@oats-ts/validators'

export const pathsObject = object(dictionaryOf(object()))
