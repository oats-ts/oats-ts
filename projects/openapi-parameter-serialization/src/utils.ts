export function entries<K extends string, V>(input: Record<K, V>): [K, V][] {
  return Object.keys(input).map((key: string) => [key as K, input[key as K] as V])
}

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function decode(value: string): string

export function decode(value?: string): string | undefined {
  return isNil(value) ? undefined : decodeURIComponent(value)
}

export function encode(value?: string): string {
  return isNil(value)
    ? ''
    : encodeURIComponent(`${value}`).replace(
        /[\.,;=!'()*]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
      )
}

export function has(input: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key)
}
