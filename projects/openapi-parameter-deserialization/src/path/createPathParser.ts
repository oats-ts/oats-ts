import { ParameterObject, PathDeserializers } from '../types'
import { createRawPathParser } from './createRawPathParser'

export const createPathParser = <T extends ParameterObject>(
  template: string,
  regex: RegExp,
  deserializers: PathDeserializers<T>,
) => {
  const parseRawPath = createRawPathParser(template, regex)
  return (input: string): T => {
    const raw = parseRawPath(input)
    const output: ParameterObject = {}
    const keys = Object.keys(deserializers)

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const deserializer = deserializers[key]
      output[key] = deserializer(key)(raw)
    }

    return output as T
  }
}
