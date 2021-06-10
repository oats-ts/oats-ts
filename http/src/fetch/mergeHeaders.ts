import { HttpHeaders } from '..'
import { asHttpHeaders } from './asHttpHeaders'

export function mergeHeaders(...headers: HeadersInit[]): HttpHeaders {
  const httpHeaders: HttpHeaders = {}
  for (let i = 0; i < headers.length; i += 1) {
    const mixedHeaders = headers[i]
    Object.assign(httpHeaders, asHttpHeaders(mixedHeaders))
  }
  return httpHeaders
}
