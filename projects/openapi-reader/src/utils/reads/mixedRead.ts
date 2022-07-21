import { failure, Try } from '@oats-ts/try'
import URI from 'urijs'
import { SchemeConfig } from '../../typings'
import { DefaultMixedSchemeConfig } from '../defaultMixedSchemeConfig'
import { unexpectedSchemeIssue } from '../unexpectedSchemeIssue'
import { fileRead } from './fileRead'
import { httpRead } from './httpRead'
import { httpsRead } from './httpsRead'

export const mixedRead =
  (config: SchemeConfig = DefaultMixedSchemeConfig) =>
  async (uri: string): Promise<Try<string>> => {
    try {
      const scheme = new URI(uri).scheme()
      if (scheme === 'http' && config.http) {
        return httpRead(uri)
      } else if (scheme === 'https' && config.https) {
        return httpsRead(uri)
      } else if (scheme === 'file' && config.file) {
        return fileRead(uri)
      }
      return failure(unexpectedSchemeIssue(uri, scheme, config))
    } catch (error) {
      return failure({
        message: `${error}`,
        path: uri,
        severity: 'error',
      })
    }
  }
