import { fields, object, string } from '@oats-ts/validators'

export const referenceObject = object(fields({ $ref: string() }))
