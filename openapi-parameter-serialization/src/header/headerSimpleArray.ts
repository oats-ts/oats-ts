import { Options, PrimitiveArray } from '../types'

export const headerSimpleArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
