import { SourceFile } from 'typescript'
import { GeneratedFile } from '../typings'
import { failure, success, Try } from '@oats-ts/try'
import { promises } from 'fs'
import { resolve, dirname } from 'path'
import { isNode } from 'browser-or-node'

async function exists(dir: string): Promise<boolean> {
  try {
    const stats = await promises.lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

export async function fileWrite(path: string, content: string, _file: SourceFile): Promise<Try<GeneratedFile>> {
  if (!isNode) {
    return failure({
      message: `Can only write files in a node.js environment.`,
      path: path,
      severity: 'error',
    })
  }
  const _path = resolve(path)
  const dir = dirname(_path)
  const dirExists = await exists(dir)
  if (!dirExists) {
    await promises.mkdir(dir, { recursive: true })
  }
  try {
    await promises.writeFile(_path, content, { encoding: 'utf-8' })
    return success({ path, content })
  } catch (e) {
    return failure({
      message: `${e}`,
      path: _path,
      severity: 'error',
    })
  }
}
