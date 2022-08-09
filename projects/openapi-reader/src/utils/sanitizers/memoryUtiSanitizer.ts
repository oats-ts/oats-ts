import { success, Try } from '@oats-ts/try'
import { isNil, has } from 'lodash'
import { MemoryReadContent, SanitizeFn } from '../../typings'

export const memoryUriSanitizer =
  (delegate: SanitizeFn, content: MemoryReadContent) =>
  async (path: string): Promise<Try<string>> => {
    if (has(content, path) && !isNil(content[path])) {
      return success(path)
    }
    return delegate(path)
  }
