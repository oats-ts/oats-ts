import { NamedSimpleObject } from '../types/NamedSimpleObject'

export function isNamedSimpleObject(input: any): input is NamedSimpleObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.booleanProperty === 'boolean' &&
    typeof input.numberProperty === 'number' &&
    (input.optionalBooleanProperty === null ||
      input.optionalBooleanProperty === undefined ||
      typeof input.optionalBooleanProperty === 'boolean') &&
    (input.optionalNumberProperty === null ||
      input.optionalNumberProperty === undefined ||
      typeof input.optionalNumberProperty === 'number') &&
    (input.optionalStringProperty === null ||
      input.optionalStringProperty === undefined ||
      typeof input.optionalStringProperty === 'string') &&
    typeof input.stringProperty === 'string'
  )
}
