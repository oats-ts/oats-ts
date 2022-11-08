import { PathProviderHelper } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export const ExpressRouterFactoriesDefaultLocals = {
  request: 'request',
  response: 'response',
  next: 'next',
  locals: 'locals',
  router: 'router',
  api: 'api',
  adapter: 'adapter',
  toolkit: 'toolkit',
  error: 'error',
  path: 'path',
  query: 'query',
  requestHeaders: 'headers',
  cookies: 'cookies',
  requestBody: 'body',
  mimeType: 'mimeType',
  body: 'body',
  corsConfig: 'corsConfig',
  corsHeaders: 'corsHeaders',
  typedRequest: 'typedRequest',
  typedResponse: 'typedResponse',
  rawResponse: 'rawResponse',
  apiKey: (document: OpenAPIObject, helper: PathProviderHelper) => {
    return `__oats_api_${helper.hashOf(document)?.toString(36)}`
  },
  adapterKey: (document: OpenAPIObject, helper: PathProviderHelper) => {
    return `__oats_adapter_${helper.hashOf(document)?.toString(36)}`
  },
} as const
