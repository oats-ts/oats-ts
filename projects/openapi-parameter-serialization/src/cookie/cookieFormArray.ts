import { QueryOptions, PrimitiveArray } from '../types'

export const cookieFormArray =
  <T extends PrimitiveArray>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    throw new Error('not implemented')
  }
