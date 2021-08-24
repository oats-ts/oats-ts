import { RefOfExternalNamedSchema } from '../types/RefOfExternalNamedSchema'
import { isExternalNamedSchema } from './isExternalNamedSchema'

export function isRefOfExternalNamedSchema(input: any): input is RefOfExternalNamedSchema {
  return isExternalNamedSchema(input)
}
