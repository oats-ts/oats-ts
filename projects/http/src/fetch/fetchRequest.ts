import { RequestFn, HttpRequest } from '../typings'
import { mergeHeaders } from '../common/mergeHeaders'

export const fetchRequest = (init: RequestInit = {}): RequestFn => {
  return async function fetchAdapterInstance(request: HttpRequest): Promise<Response> {
    const fetchRequest: RequestInit = {
      ...(init || {}),
      headers: mergeHeaders(init?.headers, request.headers),
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    return await fetch(request.url, fetchRequest)
  }
}
