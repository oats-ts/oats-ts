import { object, optional, shape, string } from '@oats-ts/validators'

export const namedDeprecatedObjectValidator = object(shape({ deprecatedProperty: optional(string()) }))
