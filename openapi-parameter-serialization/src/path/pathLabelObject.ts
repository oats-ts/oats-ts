import { Options, PrimitiveRecord } from '../types'

export const pathLabelObject =
  <T extends PrimitiveRecord>(options: Options<T>) =>
  (name: string) =>
  (value: T) => {
    return ''
  }
