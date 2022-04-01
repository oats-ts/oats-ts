import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { isUri } from 'valid-url'
import URI from 'urijs'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

const AcceptedSchemes = ['file', 'http', 'https']

export const mixedUriSanitizer = (path: string): Try<string> => {
  try {
    if (isUri(path)) {
      const uri = new URI(path)
      const scheme = uri.scheme()
      if (AcceptedSchemes.indexOf(scheme) < 0) {
        const schemesMsg = AcceptedSchemes.map((s) => `"${s}"`).join(', ')
        return failure([
          {
            path: 'path',
            severity: 'error',
            type: IssueTypes.other,
            message: `unexpected URI scheme: "${scheme}", should be one of ${schemesMsg}`,
          },
        ])
      }
      return success(path)
    }
    return success(pathToFileURL(resolve(path)).toString())
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
