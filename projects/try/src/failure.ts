import { Issue } from '@oats-ts/validators'
import { Failure } from './types'

export function failure(issues: Issue[]): Failure {
  return { issues }
}
