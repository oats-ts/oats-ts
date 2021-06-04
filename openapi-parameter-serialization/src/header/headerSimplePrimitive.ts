import { Options, Primitive } from '../types'

export const headerSimplePrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
