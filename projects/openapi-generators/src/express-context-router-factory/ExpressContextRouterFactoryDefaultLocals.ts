import { LocalNameProviderHelper } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export const ExpressContextRouterFactoryDefaultLocals = {
  request: '_',
  response: 'response',
  next: 'next',
  router: 'router',
  api: 'api',
  adapter: 'adapter',
  apiKey: (document: OpenAPIObject, helper: LocalNameProviderHelper) => {
    return `__oats_api_${helper.hashOf(document)?.toString(36)}`
  },
  adapterKey: (document: OpenAPIObject, helper: LocalNameProviderHelper) => {
    return `__oats_adapter_${helper.hashOf(document)?.toString(36)}`
  },
} as const
