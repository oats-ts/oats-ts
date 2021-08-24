import { NamedBoolean } from '../types/NamedBoolean'

export function isNamedBoolean(input: any): input is NamedBoolean {
  return typeof input === 'boolean'
}
