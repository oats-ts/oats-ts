import { array, items, string } from '@oats-ts/validators'

export const namedStringArrayValidator = array(items(string()))
