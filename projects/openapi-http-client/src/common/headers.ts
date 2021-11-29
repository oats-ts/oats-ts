import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { asRawHttpHeaders } from './asRawHttpHeaders'
import { ResponseLike } from './typings'

export async function headers(response: ResponseLike): Promise<RawHttpHeaders> {
  return asRawHttpHeaders(response.headers)
}
