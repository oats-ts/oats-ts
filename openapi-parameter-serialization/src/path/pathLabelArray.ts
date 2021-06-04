import { Options, PrimitiveArray } from '../types'

export const pathLabelArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
