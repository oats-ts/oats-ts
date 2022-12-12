import { failure } from './failure'
import { isFailure } from './isFailure'
import { Failure } from './types'

export function fromCaughtError(error: any, defaultPath: string = '@oats-ts/try'): Failure {
  if (isFailure(error)) {
    return error
  } else if (error instanceof Error) {
    failure({
      message: `${error.stack}`,
      severity: 'error',
      path: defaultPath,
    })
  }
  return failure({
    message: `${error}`,
    severity: 'error',
    path: defaultPath,
  })
}
