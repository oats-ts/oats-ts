import { Options, PrimitiveRecord } from '../types'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
