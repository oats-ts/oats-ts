import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import URI from 'urijs'
import { fetch } from 'cross-fetch'

export const networkRead =
  (expectedScheme: string) =>
  async (uri: string): Promise<Try<string>> => {
    const scheme = new URI(uri).scheme()

    if (scheme !== expectedScheme) {
      return failure([
        {
          message: `expected "http" protocol`,
          path: uri,
          severity: 'error',
          type: IssueTypes.other,
        },
      ])
    }

    try {
      const response = await fetch(uri)
      const text = await response.text()
      return success(text)
    } catch (error) {
      return failure([
        {
          message: `${error}`,
          path: uri,
          severity: 'error',
          type: IssueTypes.other,
        },
      ])
    }
  }
