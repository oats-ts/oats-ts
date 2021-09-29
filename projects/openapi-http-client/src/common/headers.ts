import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { asHttpHeaders } from './asHttpHeaders'
import { ResponseLike } from './typings'

export async function headers(response: ResponseLike): Promise<RawHttpHeaders> {
  return asHttpHeaders(response.headers)
}
