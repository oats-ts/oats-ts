import { PathProviderHelper } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export const ExpressCorsRouterFactoryDefaultLocals = {
  router: 'router',
  request: 'request',
  response: 'response',
  next: 'next',
  error: 'error',
  adapter: 'adapter',
  toolkit: 'toolkit',
  locals: 'locals',
  corsHeaders: 'corsHeaders',
  corsConfig: 'corsConfig',
  method: 'method',
  adapterKey: (document: OpenAPIObject, helper: PathProviderHelper) => {
    return `__oats_adapter_${helper.hashOf(document)?.toString(36)}`
  },
}
