import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { isNil } from 'lodash'

const urlPromise = typeof window === undefined ? import('url') : undefined
const fsPromise = typeof window === undefined ? import('fs/promises') : undefined
const pathPromise = typeof window === undefined ? import('path') : undefined

export async function fileRead(uri: string): Promise<Try<string>> {
  if (isNil(urlPromise) || isNil(fsPromise) || isNil(pathPromise)) {
    return failure([
      {
        message: `Can only read files from the file system in a node.js environment.`,
        path: uri,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }

  const { fileURLToPath } = await urlPromise
  const { readFile } = await fsPromise
  const { resolve } = await pathPromise

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
