import { Options, PrimitiveRecord } from '../types'

export const headerSimpleObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
