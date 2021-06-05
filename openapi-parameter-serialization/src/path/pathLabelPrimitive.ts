import { Primitive, PathOptions } from '../types'
import { encode, getPathValue } from '../utils'

export const pathLabelPrimitive =
  <T extends Primitive>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    return `.${encode(getPathValue(name, data, options), options.allowReserved)}`
  }
