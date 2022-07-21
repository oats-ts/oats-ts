import { isUri } from 'valid-url'
import URI from 'urijs'
import { failure, success, Try } from '@oats-ts/try'
import { DefaultMixedSchemeConfig } from '../defaultMixedSchemeConfig'
import { SchemeConfig } from '../../typings'
import { unexpectedSchemeIssue } from '../unexpectedSchemeIssue'
import { sanitizeNonUriPath } from './sanitizeNonUriPath'

export const mixedUriSanitizer =
  (config: SchemeConfig = DefaultMixedSchemeConfig, uriOnly: boolean = false) =>
  async (path: string): Promise<Try<string>> => {
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
        return failure(unexpectedSchemeIssue('path', scheme, config))
      }
      if (uriOnly) {
        return failure({
          path: 'path',
          severity: 'error',
          message: `"${path}" should be a valid URI`,
        })
      }
      const nonUriResult = await sanitizeNonUriPath(path)
      return nonUriResult
    } catch (e) {
      return failure({
        path: 'path',
        severity: 'error',
        message: `${e}`,
      })
    }
  }
