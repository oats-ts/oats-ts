import { failure } from './failure'
import { success } from './success'
import { Try } from './types'

export function fromPromiseSettledResult<T>(input: PromiseSettledResult<T>): Try<T> {
  if (input.status === 'fulfilled') {
    return success(input.value)
  } else {
    return failure({
      message: `${input.reason}`,
      path: '',
      severity: 'error',
    })
  }
}
