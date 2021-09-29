import { RawHttpRequest } from '@oats-ts/openapi-http'
import { mergeHeaders } from '../common/mergeHeaders'
import fetch, { RequestInit, Response } from 'node-fetch'

export const request = (init: RequestInit = {}) => {
  return async function nodeFetch(request: RawHttpRequest): Promise<Response> {
    const fetchRequest: RequestInit = {
      ...(init || {}),
      headers: mergeHeaders(init?.headers, request.headers),
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    return await fetch(request.url, fetchRequest)
  }
}
