import { Options, PrimitiveRecord } from '../types'

export const pathSimpleObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
