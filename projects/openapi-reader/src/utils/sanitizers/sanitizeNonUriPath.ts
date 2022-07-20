import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { pathToFileURL } from 'url'
import { resolve } from 'path'
import { isNode } from 'browser-or-node'

export async function sanitizeNonUriPath(path: string): Promise<Try<string>> {
  if (!isNode) {
    return failure([
      {
        message: `Can only read files from the file system in a node.js environment.`,
        path: path,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
  return success(pathToFileURL(resolve(path)).toString())
}
