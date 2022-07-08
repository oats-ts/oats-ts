import { IssueTypes } from '@oats-ts/validators'
import { failure } from './failure'
import { success } from './success'
import { Try } from './types'

export function fromPromise<T>(input: Promise<T>): Promise<Try<T>> {
  return input
    .then((data) => success(data))
    .catch((error) =>
      failure([
        {
          message: `${error}`,
          severity: 'error',
          path: '',
          type: IssueTypes.other,
        },
      ]),
    )
}
