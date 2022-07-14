import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { success, Try } from '@oats-ts/try'

export function sanitizePath(path: string): Try<string> {
  return success(pathToFileURL(resolve(path)).toString())
}
