import { Options, PrimitiveRecord } from '../types'

export const cookieFormObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
