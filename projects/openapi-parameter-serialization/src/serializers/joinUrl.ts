import { isNil } from './utils'

export function joinUrl(base: string, path: string, query?: string) {
  if (isNil(path)) {
    throw new TypeError(`Parameter "path" cannot be ${path}.`)
  }
  return [isNil(base) ? '' : base, path, isNil(query) ? '' : query].join('')
}
