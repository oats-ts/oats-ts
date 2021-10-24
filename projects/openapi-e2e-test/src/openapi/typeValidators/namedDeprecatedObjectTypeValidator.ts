import { object, optional, shape, string } from '@oats-ts/validators'

export const namedDeprecatedObjectTypeValidator = object(shape({ deprecatedProperty: optional(string()) }))
