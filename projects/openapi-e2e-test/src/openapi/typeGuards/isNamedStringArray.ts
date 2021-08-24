import { NamedStringArray } from '../types/NamedStringArray'

export function isNamedStringArray(input: any): input is NamedStringArray {
  return Array.isArray(input) && input.every((item: any) => typeof item === 'string')
}
