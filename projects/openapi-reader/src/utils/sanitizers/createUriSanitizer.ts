import URI from 'urijs'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

export const createUriSanitizer =
  (expectedScheme: string) =>
  async (path: string): Promise<Try<string>> => {
    try {
      const uri = new URI(path)
      const scheme = uri.scheme()
      if (expectedScheme !== scheme) {
        return failure([
          {
            path: 'path',
            severity: 'error',
            type: IssueTypes.other,
            message: `unexpected URI scheme: "${scheme}", should be "${expectedScheme}"`,
          },
        ])
      }
      return success(path)
    } catch (e) {
      return failure([
        {
          path: 'path',
          severity: 'error',
          type: IssueTypes.other,
          message: `${e}`,
        },
      ])
    }
  }
