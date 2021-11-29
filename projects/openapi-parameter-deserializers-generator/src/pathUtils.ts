import { ParameterSegment, parsePathToSegments } from '@oats-ts/openapi-parameter-common'
import { pathToRegexp } from 'path-to-regexp'

export function createPathRegex(path: string): RegExp {
  const segments = parsePathToSegments(path)
  const regexpInput = segments.map((segment) => (segment.type === 'text' ? segment.value : `:${segment.name}`)).join('')
  return pathToRegexp(regexpInput, [])
}

export function getPathParameterNames(path: string) {
  return parsePathToSegments(path)
    .filter((s) => s.type === 'parameter')
    .map((p: ParameterSegment) => p.name)
}
