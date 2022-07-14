import { failure, success, Try } from '@oats-ts/try'
import { isNil } from 'lodash'
import { IssueTypes } from '@oats-ts/validators'

const urlPromise = typeof window === undefined ? import('url') : undefined
const pathPromise = typeof window === undefined ? import('path') : undefined

export async function sanitizeNonUriPath(path: string): Promise<Try<string>> {
  if (isNil(urlPromise) || isNil(pathPromise)) {
    return failure([
      {
        message: `Can only sanitize non-URI paths in a node.js environment.`,
        path: path,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
  const { pathToFileURL } = await urlPromise
  const { resolve } = await pathPromise

  return success(pathToFileURL(resolve(path)).toString())
}
