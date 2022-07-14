import { SourceFile } from 'typescript'
import { GeneratedFile } from '../typings'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { isNil } from 'lodash'

const fsPromise = typeof window === 'undefined' ? import('fs/promises') : undefined
const pathPromise = typeof window === 'undefined' ? import('path') : undefined

async function exists(dir: string): Promise<boolean> {
  if (isNil(fsPromise)) {
    return false
  }
  const { lstat } = await fsPromise
  try {
    const stats = await lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

export async function fileWrite(path: string, content: string, _file: SourceFile): Promise<Try<GeneratedFile>> {
  if (isNil(pathPromise) || isNil(fsPromise)) {
    return failure([
      {
        message: `Can only write files in a node.js environment.`,
        path: path,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
  const { mkdir, writeFile } = await fsPromise
  const { resolve, dirname } = await pathPromise

  const _path = resolve(path)
  const dir = dirname(_path)
  const dirExists = await exists(dir)
  if (!dirExists) {
    await mkdir(dir, { recursive: true })
  }
  try {
    await writeFile(_path, content, { encoding: 'utf-8' })
    return success({ path, content })
  } catch (e) {
    return failure([
      {
        message: `${e}`,
        path: _path,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
}
