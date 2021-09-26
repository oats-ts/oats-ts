import { ValueParser, RawPathParams, PathOptions } from '../types'
import { Primitive } from '../types'
import { decode } from '../utils'
import { getPathValue } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawValue = getPathValue(name, data)
    
    return parse(name, decode(getPathValue(name, data)))
  }
