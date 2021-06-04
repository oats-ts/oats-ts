import { Options, PrimitiveArray } from '../types'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
