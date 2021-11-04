import { PathParametersPayload } from '../types/PathParametersPayload'
import { isNumberArray } from './isNumberArray'
import { isSimpleEnum } from './isSimpleEnum'
import { isSimpleObject } from './isSimpleObject'

export function isPathParametersPayload(input: any): input is PathParametersPayload {
  return (
    input !== null &&
    typeof input === 'object' &&
    isNumberArray(input.a) &&
    isNumberArray(input.ae) &&
    typeof input.b === 'boolean' &&
    typeof input.be === 'boolean' &&
    isSimpleEnum(input.e) &&
    isSimpleEnum(input.ee) &&
    typeof input.n === 'number' &&
    typeof input.ne === 'number' &&
    isSimpleObject(input.o) &&
    isSimpleObject(input.oe) &&
    typeof input.s === 'string' &&
    typeof input.se === 'string'
  )
}
