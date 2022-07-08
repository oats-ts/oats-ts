import { parsePathToSegments } from '@oats-ts/openapi-parameter-serialization'

export function getPathTemplate(path: string): string {
  const segments = parsePathToSegments(path)
  return segments.map((segment) => (segment.type === 'text' ? segment.value : `:${segment.name}`)).join('')
}
