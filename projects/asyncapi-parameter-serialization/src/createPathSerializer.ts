import { PrimitiveRecord } from './types'
import { parsePathToSegments } from './parsePathToSegments'
import { validatePathInput } from './validatePathInput'

export function createPathSerializer(path: string) {
  const segments = parsePathToSegments(path)
  return function pathSerializer<T extends PrimitiveRecord>(input: T): string {
    validatePathInput(segments, input)
    return segments
      .map((segment) => {
        switch (segment.type) {
          case 'parameter': {
            return encodeURIComponent(input[segment.name])
          }
          case 'text':
            return segment.value
        }
      })
      .join('')
  }
}
