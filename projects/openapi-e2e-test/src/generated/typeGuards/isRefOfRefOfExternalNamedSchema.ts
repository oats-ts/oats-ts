import { RefOfRefOfExternalNamedSchema } from '../types/RefOfRefOfExternalNamedSchema'
import { isRefOfExternalNamedSchema } from './isRefOfExternalNamedSchema'

export function isRefOfRefOfExternalNamedSchema(input: any): input is RefOfRefOfExternalNamedSchema {
  return isRefOfExternalNamedSchema(input)
}
