import { NamedNumber } from '../types/NamedNumber'

export function isNamedNumber(input: any): input is NamedNumber {
  return typeof input === 'number'
}
