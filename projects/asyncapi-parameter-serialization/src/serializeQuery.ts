import { PrimitiveRecord } from './types'

export function serializeQuery<T extends PrimitiveRecord>(input: T): string {
  const parts: string[] = []
  const keys = Object.keys(input)

  for (let i = 0; i < keys.length; i += 1) {
    const name = keys[i]
    const value = input[name]
    const part = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    parts.push(part)
  }

  return parts.length === 0 ? undefined : `?${parts.join('&')}`
}
