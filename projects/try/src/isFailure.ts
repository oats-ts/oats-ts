import { FAILURE_SYMBOL } from './symbols'
import { Failure, Try } from './types'

export function isFailure(input?: Try<unknown>): input is Failure {
  return typeof input === 'object' && input !== null && (input as any)[FAILURE_SYMBOL] === true
}
