import { SimpleObject } from '../types/SimpleObject'
import { isSimpleEnum } from './isSimpleEnum'

export function isSimpleObject(input: any): input is SimpleObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.b === null || input.b === undefined || typeof input.b === 'boolean') &&
    (input.e === null || input.e === undefined || isSimpleEnum(input.e)) &&
    (input.n === null || input.n === undefined || typeof input.n === 'number') &&
    (input.s === null || input.s === undefined || typeof input.s === 'string')
  )
}
