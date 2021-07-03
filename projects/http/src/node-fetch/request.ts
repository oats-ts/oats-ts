import { HttpRequest } from '../typings'
import { mergeHeaders } from '../common/mergeHeaders'
import fetch, { RequestInit, Response } from 'node-fetch'

export const request = (init: RequestInit = {}) => {
  return async function nodeFetch(request: HttpRequest): Promise<Response> {
    const fetchRequest: RequestInit = {
      ...(init || {}),
      headers: mergeHeaders(init?.headers, request.headers),
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    return await fetch(request.url, fetchRequest)
  }
}
