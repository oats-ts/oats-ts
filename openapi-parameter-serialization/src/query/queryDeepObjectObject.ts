import { Options, PrimitiveRecord } from '../types'

export const queryDeepObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
