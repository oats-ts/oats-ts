import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import URI from 'urijs'
import { fetch } from 'cross-fetch'
import { SchemeConfig } from '../typings'
import { DefaultMixedSchemeConfig } from './defaultMixedSchemeConfig'
import { unexpectedSchemeIssue } from './unexpectedSchemeIssue'
// Node only
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

export async function fileRead(uri: string): Promise<Try<string>> {
  try {
    const path = resolve(fileURLToPath(uri))
    const content = await readFile(path, { encoding: 'utf-8' })
    return success(content)
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

export const httpRead = networkRead('http')
export const httpsRead = networkRead('https')

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
      return failure([unexpectedSchemeIssue(uri, scheme, config)])
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
