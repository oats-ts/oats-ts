import { ExternalNamedSchema } from '../types/ExternalNamedSchema'
import { isAdditionalServiceType } from './isAdditionalServiceType'

export function isExternalNamedSchema(input: any): input is ExternalNamedSchema {
  return isAdditionalServiceType(input)
}
