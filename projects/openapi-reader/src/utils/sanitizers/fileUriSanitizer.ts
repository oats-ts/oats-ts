import { isUri } from 'valid-url'
import URI from 'urijs'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { sanitizeNonUriPath } from './sanitizeNonUriPath'

export async function fileUriSanitizer(path: string): Promise<Try<string>> {
  try {
    if (isUri(path)) {
      const uri = new URI(path)
      if (uri.scheme() !== 'file') {
        return failure([
          {
            path: 'path',
            severity: 'error',
            type: IssueTypes.other,
            message: `unexpected URI scheme: "${uri.scheme()}", should be "file"`,
          },
        ])
      }
      return success(path)
    }
    return sanitizeNonUriPath(path)
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
