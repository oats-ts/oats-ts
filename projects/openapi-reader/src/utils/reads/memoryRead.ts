import { success, Try } from '@oats-ts/try'
import { has, isNil } from 'lodash'
import { MemoryReadContent, ReadFn } from '../../typings'

export const memoryRead =
  (delegate: ReadFn, content: MemoryReadContent) =>
  async (uri: string): Promise<Try<string>> => {
    if (has(content, uri) && !isNil(content[uri])) {
      return success(content[uri]!)
    }
    return delegate(uri)
  }
