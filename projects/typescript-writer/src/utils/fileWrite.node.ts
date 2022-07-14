import { resolve, dirname } from 'path'
import { lstat, mkdir, writeFile } from 'fs/promises'
import { SourceFile } from 'typescript'
import { GeneratedFile } from '../typings'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

async function exists(dir: string): Promise<boolean> {
  try {
    const stats = await lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

export async function fileWrite(path: string, content: string, _file: SourceFile): Promise<Try<GeneratedFile>> {
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
