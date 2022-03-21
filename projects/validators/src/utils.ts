export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function hasOwnProperty(obj: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property)
}
