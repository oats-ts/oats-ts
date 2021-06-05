import { QueryOptions, Primitive } from '../types'

export const headerSimplePrimitive =
  <T extends Primitive>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
