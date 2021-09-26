import { PathSegment } from './types'
import { isNil } from './utils'

export function parsePathToSegments(path: string): PathSegment[] {
  if (isNil(path) || path.length === 0) {
    return []
  }

  let isParameterSegment: boolean = false
  let segment: string = ''

  const segments: PathSegment[] = []

  for (let i = 0; i < path.length; i += 1) {
    const char = path[i]
    if (!isParameterSegment && char === '{') {
      isParameterSegment = true
      if (segment.length > 0) {
        segments.push({ type: 'text', value: segment })
      }
      segment = ''
    } else if (isParameterSegment && char === '}') {
      isParameterSegment = false
      if (segment.length === 0) {
        throw new Error(`Empty parameter segment "{}" in ${path}`)
      }
      segments.push({ type: 'parameter', name: segment })
      segment = ''
    } else {
      segment += char
    }
  }

  if (isParameterSegment) {
    throw new Error(`Unfinished parameter segment "{${segment}" in "${path}"`)
  }

  if (segment.length > 0) {
    segments.push({ type: 'text', value: segment })
  }

  return segments
}
