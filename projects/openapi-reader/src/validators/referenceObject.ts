import { shape, object, string } from '@oats-ts/validators'

export const referenceObject = object(shape({ $ref: string() }))
