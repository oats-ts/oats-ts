import { Issue } from '@oats-ts/validators'
import { FAILURE_SYMBOL } from './symbols'
import { Failure } from './types'

export function failure(...issues: Issue[]): Failure {
  return { issues, [FAILURE_SYMBOL]: true }
}
