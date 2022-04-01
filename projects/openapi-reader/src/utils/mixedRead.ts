import { failure, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import URI from 'urijs'
import { fileRead } from './fileRead'
import { httpRead } from './httpRead'
import { httpsRead } from './httpsRead'

export async function mixedRead(uri: string): Promise<Try<string>> {
  try {
    const scheme = new URI(uri).scheme()
    switch (scheme) {
      case 'http':
        return httpRead(uri)
      case 'https':
        return httpsRead(uri)
      case 'file':
        return fileRead(uri)
      default:
        return failure([
          {
            message: `unexpected URI scheme: "${scheme}" (expected "http", "https" or "file")`,
            path: uri,
            severity: 'error',
            type: IssueTypes.other,
          },
        ])
    }
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
