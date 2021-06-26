import { HeadersInitLike } from './typings'
import { HttpHeaders } from '../typings'
import { asHttpHeaders } from './asHttpHeaders'

export function mergeHeaders(...headers: HeadersInitLike[]): HttpHeaders {
  const httpHeaders: HttpHeaders = {}
  for (let i = 0; i < headers.length; i += 1) {
    const mixedHeaders = headers[i]
    Object.assign(httpHeaders, asHttpHeaders(mixedHeaders))
  }
  return httpHeaders
}
