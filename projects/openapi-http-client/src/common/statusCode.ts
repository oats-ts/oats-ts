import { ResponseLike } from './typings'

export async function statusCode(response: ResponseLike): Promise<number> {
  return response.status
}
