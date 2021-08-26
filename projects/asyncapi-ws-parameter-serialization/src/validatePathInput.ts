import { ParameterSegment, PathSegment, PrimitiveRecord } from './types'
import { isNil } from './utils'

const hasOwnProperty = Object.prototype.hasOwnProperty

export function validatePathInput(segments: PathSegment[], input: PrimitiveRecord) {
  const parameterSegments = segments.filter(({ type }) => type === 'parameter') as ParameterSegment[]
  for (let i = 0; i < parameterSegments.length; i += 1) {
    const param = parameterSegments[i]
    if (!hasOwnProperty.call(input, param.name)) {
      throw new TypeError(`Path parameter "${param.name}" is missing`)
    }
    const value = input[param.name]
    if (isNil(input[param.name])) {
      throw new TypeError(`Path parameter "${param.name}" cannot be ${value}`)
    }
  }
  const fieldNames = Object.keys(input)
  for (let i = 0; i < fieldNames.length; i += 1) {
    const fieldName = fieldNames[i]
    if (!parameterSegments.some((param) => param.name === fieldName)) {
      throw new TypeError(`Input parameter "${fieldName}" is not part of the url template`)
    }
  }
}
