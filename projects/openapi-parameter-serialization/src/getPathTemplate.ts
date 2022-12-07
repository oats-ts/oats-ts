import { parsePathToSegments } from './parsePathToSegments'

export function getPathTemplate(path: string): string {
  return parsePathToSegments(path)
    .filter((seg) => seg.location === 'path')
    .map((seg) => (seg.type === 'text' ? seg.value : `:${seg.name}`))
    .join('')
}
