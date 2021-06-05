import { QueryOptions, PrimitiveRecord } from '../types'

export const headerSimpleObject =
  <T extends PrimitiveRecord>(options: QueryOptions<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
