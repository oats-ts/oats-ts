import { Options, Primitive } from '../types'

export const queryFormPrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
