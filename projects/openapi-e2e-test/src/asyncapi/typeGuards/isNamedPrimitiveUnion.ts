import { NamedPrimitiveUnion } from '../types/NamedPrimitiveUnion'

export function isNamedPrimitiveUnion(input: any): input is NamedPrimitiveUnion {
  return typeof input === 'number' || typeof input === 'string' || typeof input === 'boolean'
}
