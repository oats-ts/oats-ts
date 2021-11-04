import { SimpleObject } from '../types/SimpleObject'
import { isSimpleEnum } from './isSimpleEnum'

export function isSimpleObject(input: any): input is SimpleObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.b === 'boolean' &&
    isSimpleEnum(input.e) &&
    typeof input.n === 'number' &&
    typeof input.s === 'string'
  )
}
