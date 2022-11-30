import { pathToRegexp } from 'path-to-regexp'
import { parsePathToSegments } from './parsePathToSegments'

export function parsePathToMatcher(path: string): RegExp {
  const segments = parsePathToSegments(path)
  const regexpInput = segments.map((segment) => (segment.type === 'text' ? segment.value : `:${segment.name}`)).join('')
  return pathToRegexp(regexpInput, [])
}
