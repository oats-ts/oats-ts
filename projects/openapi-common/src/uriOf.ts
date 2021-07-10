import { OpenAPIReadOutput } from '../../openapi-reader/lib'

export function uriOf(data: OpenAPIReadOutput) {
  return function _uriOf(input: any): string {
    return data.objectToUri.get(input)
  }
}
