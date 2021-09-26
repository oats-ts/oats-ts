import { RawPathParams } from '..'
import { isNil } from '../utils'

export function getPathValue(name: string, raw: RawPathParams): string {
  const value = raw[name]
  if (isNil(value)) {
    throw new TypeError(`Path parameter "${name}" cannot be ${value}`)
  }
  return value
}
