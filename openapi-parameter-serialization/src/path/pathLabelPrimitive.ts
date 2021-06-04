import { Options, Primitive } from '../types'

export const pathLabelPrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
