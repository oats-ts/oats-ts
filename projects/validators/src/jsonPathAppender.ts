export function jsonPathAppender(path: string, ...segments: string[]): string {
  return [path].concat(segments.map((segment) => `["${segment}"]`)).join('')
}
