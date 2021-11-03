import { array, items, number } from '@oats-ts/validators'

export const numberArrayTypeValidator = array(items(number()))
