export function appendPath(path: string, segment: string | number): string {
  if (typeof segment === 'number') {
    return `${path}[${segment}]`
  }
  if (typeof segment === 'string' && /^[$A-Za-z_$][0-9a-zA-Z_$]*$/s.test(segment)) {
    return `${path}.${segment}`
  }
  return `${path}["${segment}"]`
}
