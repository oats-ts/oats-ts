import { Options, PrimitiveRecord } from '../types'

export const queryFormObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
