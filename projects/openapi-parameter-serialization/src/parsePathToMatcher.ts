import { pathToRegexp } from 'path-to-regexp'
import { getPathTemplate } from './getPathTemplate'

export function parsePathToMatcher(path: string): RegExp {
  return pathToRegexp(getPathTemplate(path), [])
}
