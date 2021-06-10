import { HttpAdapter, HttpRequest, HttpResponse } from '..'
import { asHttpHeaders } from './asHttpHeaders'
import { mergeHeaders } from './mergeHeaders'
import { FetchAdapterConfig } from './typings'
import { defaultFetchAdapterConfig } from './defaults/defaultFetchAdapterConfig'

export const fetchAdapter = (config: FetchAdapterConfig = {}): HttpAdapter => {
  const { init, parse } = defaultFetchAdapterConfig(config)
  return async (request: HttpRequest): Promise<HttpResponse> => {
    const fetchRequest: RequestInit = {
      ...(init || {}),
      headers: mergeHeaders(init?.headers, request.headers),
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    const response = await fetch(request.url, fetchRequest)
    const body = await parse(response)
    return {
      body,
      statusCode: response.status,
      headers: asHttpHeaders(response.headers),
    }
  }
}
