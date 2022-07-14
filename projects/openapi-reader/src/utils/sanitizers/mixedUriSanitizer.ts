import { isUri } from 'valid-url'
import URI from 'urijs'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { DefaultMixedSchemeConfig } from '../defaultMixedSchemeConfig'
import { SchemeConfig } from '../../typings'
import { unexpectedSchemeIssue } from '../unexpectedSchemeIssue'

export const mixedUriSanitizer =
  (sanitizeNonUri: (path: string) => Try<string>) =>
  (config: SchemeConfig = DefaultMixedSchemeConfig, uriOnly: boolean = false) =>
  (path: string): Try<string> => {
    try {
      if (isUri(path)) {
        const uri = new URI(path)
        const scheme = uri.scheme()
        if (scheme === 'http' && config.http) {
          return success(path)
        } else if (scheme === 'https' && config.https) {
          return success(path)
        } else if (scheme === 'file' && config.file) {
          return success(path)
        }
        return failure([unexpectedSchemeIssue('path', scheme, config)])
      }
      if (uriOnly) {
        return failure([
          {
            path: 'path',
            severity: 'error',
            type: IssueTypes.other,
            message: `"${path}" should be a valid URI`,
          },
        ])
      }
      return sanitizeNonUri(path)
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
