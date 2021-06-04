import { Options, PrimitiveArray } from '../types'

export const queryFormArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
