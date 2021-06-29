import { RequestFn, HttpRequest } from '../typings'
import { mergeHeaders } from '../common/mergeHeaders'
import fetch, { RequestInit, Response } from 'node-fetch'

export const nodeFetchRequest = (init: RequestInit = {}): RequestFn => {
  return async function nodeFetchAdapterInstance(request: HttpRequest): Promise<Response> {
    const fetchRequest: RequestInit = {
      ...(init || {}),
      headers: mergeHeaders(init?.headers, request.headers),
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    return await fetch(request.url, fetchRequest)
  }
}
