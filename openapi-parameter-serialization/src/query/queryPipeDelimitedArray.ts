import { Options, PrimitiveArray } from '../types'

export const queryPipeDelimitedArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
