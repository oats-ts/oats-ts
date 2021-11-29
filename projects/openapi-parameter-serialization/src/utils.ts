export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function encode<T>(value: T, replaceDot: boolean = false): string {
  const encoded = encodeURIComponent(`${value}`)
  return replaceDot ? encoded.replace(/\./g, '%2E') : encoded
}
