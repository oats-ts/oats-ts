import { HeadersInitLike } from './typings'
import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { asHttpHeaders } from './asHttpHeaders'

export function mergeHeaders(...headers: HeadersInitLike[]): RawHttpHeaders {
  const httpHeaders: RawHttpHeaders = {}
  for (let i = 0; i < headers.length; i += 1) {
    const mixedHeaders = headers[i]
    Object.assign(httpHeaders, asHttpHeaders(mixedHeaders))
  }
  return httpHeaders
}
