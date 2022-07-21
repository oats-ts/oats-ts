import { failure, success, Try } from '@oats-ts/try'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { resolve } from 'path'
import { isNode } from 'browser-or-node'

export async function fileRead(uri: string): Promise<Try<string>> {
  if (!isNode) {
    return failure({
      message: `Can only read files from the file system in a node.js environment.`,
      path: uri,
      severity: 'error',
    })
  }

  try {
    const path = resolve(fileURLToPath(uri))
    const content = await fs.readFile(path, { encoding: 'utf-8' })
    return success(content)
  } catch (error) {
    return failure({
      message: `${error}`,
      path: uri,
      severity: 'error',
    })
  }
}
