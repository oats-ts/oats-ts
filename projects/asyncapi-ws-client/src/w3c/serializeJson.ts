export function serializeJson(input: any): any {
  if (typeof input === 'string' || input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    return input
  }
  return JSON.stringify(input)
}
