import { Options, PrimitiveArray } from '../types'

export const pathMatrixArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
