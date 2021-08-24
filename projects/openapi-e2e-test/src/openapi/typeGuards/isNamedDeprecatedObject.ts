import { NamedDeprecatedObject } from '../types/NamedDeprecatedObject'

export function isNamedDeprecatedObject(input: any): input is NamedDeprecatedObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.deprecatedProperty === null ||
      input.deprecatedProperty === undefined ||
      typeof input.deprecatedProperty === 'string')
  )
}
