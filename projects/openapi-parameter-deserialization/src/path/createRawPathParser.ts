import { ParameterSegment, parsePathToSegments } from '@oats-ts/openapi-parameter-common'
import { RawPathParams } from '../types'
import { isNil } from '../utils'

export const createRawPathParser = (template: string, regex: RegExp) => {
  const segments = parsePathToSegments(template).filter((segment) => segment.type === 'parameter') as ParameterSegment[]
  return (path: string): RawPathParams => {
    // Regex reset just in case before
    regex.lastIndex = 0

    const values = regex.exec(path)
    if (isNil(values) || values.length !== segments.length + 1) {
      throw new TypeError(`Path "${path}" doesn't match template "${template}"`)
    }

    const result: RawPathParams = {}

    for (let i = 0; i < segments.length; i += 1) {
      const { name } = segments[i]
      const value = values[i + 1]
      result[name] = value
    }
    // Regex reset after, as it can be stateful with the global flag
    regex.lastIndex = 0
    return result
  }
}
