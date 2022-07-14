import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
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
