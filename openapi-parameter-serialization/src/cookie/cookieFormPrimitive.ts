import { Options, Primitive } from '../types'

export const cookieFormPrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
