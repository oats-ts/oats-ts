import { ValidatorConfig } from './typings'

export function jsonPathAppend(path: string, ...segments: string[]): string {
  return [path].concat(segments.map((segment) => `["${segment}"]`)).join('')
}

export const DefaultConfig: ValidatorConfig = {
  append: jsonPathAppend,
  path: '$',
}
