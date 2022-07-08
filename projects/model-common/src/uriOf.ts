import { ReadOutput } from './types'

export function uriOf(data: ReadOutput<any>) {
  return function _uriOf(input: any): string | undefined {
    return data.objectToUri.get(input)
  }
}
