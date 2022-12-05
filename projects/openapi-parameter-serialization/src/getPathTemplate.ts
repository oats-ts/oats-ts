import { parsePathToSegments } from './parsePathToSegments'
import { ParameterSegment, TextSegment } from './types'

export function getPathTemplate(path: string): string {
  return parsePathToSegments(path)
    .filter((seg): seg is ParameterSegment | TextSegment => seg.type === 'parameter' || seg.type === 'text')
    .map((seg) => (seg.type === 'text' ? seg.value : `:${seg.name}`))
    .join('')
}
