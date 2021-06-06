export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function encode<T>(value: T, allowReserved: boolean = false): string {
  return allowReserved ? `${value}` : encodeURIComponent(`${value}`)
}
