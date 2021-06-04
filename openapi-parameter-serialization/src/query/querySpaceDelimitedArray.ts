import { Options, Primitive, PrimitiveArray } from '../types'

export const querySpaceDelimitedArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
