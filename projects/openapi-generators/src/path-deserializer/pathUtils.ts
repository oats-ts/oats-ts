import { ParameterSegment, parsePathToSegments } from '@oats-ts/openapi-parameter-serialization'

export function getPathParameterNames(path: string): string[] {
  return parsePathToSegments(path)
    .filter((s): s is ParameterSegment => s.type === 'parameter')
    .map((p: ParameterSegment) => p.name)
}
