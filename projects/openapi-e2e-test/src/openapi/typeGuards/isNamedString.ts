import { NamedString } from '../types/NamedString'

export function isNamedString(input: any): input is NamedString {
  return typeof input === 'string'
}
