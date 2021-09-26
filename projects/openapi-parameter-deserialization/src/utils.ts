export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function decode(value: string): string {
  return isNil(value) ? value : decodeURIComponent(value)
}

export function encode(value: string): string {
  return isNil(value) ? '' : encodeURIComponent(value)
}

export function has(input: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key)
}
