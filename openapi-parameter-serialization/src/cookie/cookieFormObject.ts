import { QueryOptions, PrimitiveRecord } from '../types'

export const cookieFormObject =
  <T extends PrimitiveRecord>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    throw new Error('not implemented')
  }
