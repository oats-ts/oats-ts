export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}
