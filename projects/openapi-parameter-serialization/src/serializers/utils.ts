export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function encode<T>(value: T): string {
  return encodeURIComponent(`${value}`).replace(
    /[\.!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}
