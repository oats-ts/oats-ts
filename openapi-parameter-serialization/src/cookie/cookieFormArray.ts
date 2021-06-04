import { Options, PrimitiveArray } from '../types'

export const cookieFormArray =
  <T extends PrimitiveArray>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
