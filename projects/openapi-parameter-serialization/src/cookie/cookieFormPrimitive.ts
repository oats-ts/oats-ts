import { QueryOptions, Primitive } from '../types'

export const cookieFormPrimitive =
  <T extends Primitive>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    throw new Error('not implemented')
  }
