import { LocalNameProviderHelper } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export const ExpressCorsRouterFactoryDefaultLocals = {
  router: 'router',
  request: 'request',
  response: 'response',
  next: 'next',
  error: 'error',
  adapter: 'adapter',
  toolkit: 'toolkit',
  corsHeaders: 'corsHeaders',
  corsConfig: 'corsConfig',
  method: 'method',
  adapterKey: (document: OpenAPIObject, helper: LocalNameProviderHelper) => {
    return `__oats_adapter_${helper.hashOf(document)?.toString(36)}`
  },
}
