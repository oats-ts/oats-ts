import { StatusCodeRange } from '@oats-ts/openapi-model'

const ranges: Record<StatusCodeRange, true> = {
  '1XX': true,
  '2XX': true,
  '3XX': true,
  '4XX': true,
  '5XX': true,
}

export function isStatusCodeRange(code: string): code is StatusCodeRange {
  return Boolean(ranges[code as keyof typeof ranges])
}
