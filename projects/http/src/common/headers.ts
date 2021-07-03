import { HttpHeaders } from '../typings'
import { asHttpHeaders } from './asHttpHeaders'
import { ResponseLike } from './typings'

export async function headers(response: ResponseLike): Promise<HttpHeaders> {
  return asHttpHeaders(response.headers)
}
