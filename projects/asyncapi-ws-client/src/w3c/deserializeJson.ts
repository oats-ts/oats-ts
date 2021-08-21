export function deserializeJson(input: any): any {
  if (typeof input === 'string') {
    return JSON.parse(input)
  }
  return input
}
