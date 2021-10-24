import { array, items, string } from '@oats-ts/validators'

export const namedStringArrayTypeValidator = array(items(string()))
