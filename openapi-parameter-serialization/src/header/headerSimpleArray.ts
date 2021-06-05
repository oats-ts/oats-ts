import { QueryOptions, PrimitiveArray } from '../types'

export const headerSimpleArray =
  <T extends PrimitiveArray>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
