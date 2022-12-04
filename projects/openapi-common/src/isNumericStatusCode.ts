import { isNil } from 'lodash'

export function isNumericStatusCode(code: string): boolean {
  return !isNil(code) && code.length > 0 && `${Number(code)}` === code && Number.isInteger(parseInt(code, 10))
}
