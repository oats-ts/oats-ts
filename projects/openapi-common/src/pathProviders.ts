import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { isNil } from 'lodash'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget, NameByTarget, DelegatingPathProviderInput, PathDelegate } from './typings'

const nameByTarget: NameByTarget = {
  'openapi/type': 'types',
  'openapi/type-guard': 'typeGuards',
  'openapi/operation': 'operations',
  'openapi/query-type': 'queryTypes',
  'openapi/request-headers-type': 'requestHeaderTypes',
  'openapi/path-type': 'pathTypes',
  'openapi/response-headers-type': 'responseHeaderTypes',
  'openapi/response-type': 'responseTypes',
  'openapi/request-type': 'requestTypes',
  'openapi/request-server-type': 'requestServerTypes',
  'openapi/path-serializer': 'pathSerializers',
  'openapi/query-serializer': 'querySerializers',
  'openapi/request-headers-serializer': 'requestHeaderSerializers',
  'openapi/response-headers-serializer': 'responseHeaderSerializers',
  'openapi/path-deserializer': 'pathDeserializers',
  'openapi/query-deserializer': 'queryDeserializers',
  'openapi/request-headers-deserializer': 'requestHeaderDeserializers',
  'openapi/response-headers-deserializer': 'responseHeaderDeserializers',
  'openapi/type-validator': 'typeValidators',
  'openapi/request-body-validator': 'requestBodyValidators',
  'openapi/response-body-validator': 'responseBodyValidators',
  'openapi/express-route': 'routes',
  'openapi/express-routes-type': 'routes',
  'openapi/express-route-factory': 'routes',
  'openapi/api-stub': 'api',
  'openapi/api-type': 'api',
  'openapi/client-sdk': 'sdk',
  'openapi/sdk-stub': 'sdk',
  'openapi/sdk-type': 'sdk',
}

function singleFile(path: string): GeneratorPathProvider {
  return () => resolve(path)
}

function byName(path: string): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string) => resolve(join(path, `${name(input, target)}.ts`))
}

function byTarget(path: string, folder: Partial<NameByTarget> = {}): GeneratorPathProvider {
  const mergedFolder: NameByTarget = { ...nameByTarget, ...folder }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, mergedFolder[target as OpenAPIGeneratorTarget], `${name(input, target)}.ts`))
}

function delegating(path: string, delegates: Partial<DelegatingPathProviderInput>): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string): string => {
    const delegate = delegates[target as OpenAPIGeneratorTarget]
    if (isNil(delegate)) {
      throw new Error(`No path provider delegate found for "${target}}"`)
    }
    return delegate(path, input, name, target)
  }
}

const delegate =
  (folder?: string): PathDelegate =>
  (path: string, input: any, name: NameProvider, target: string) =>
    resolve(join(...[path, ...(isNil(folder) ? [] : [folder]), `${name(input, target)}.ts`]))

const commonDelegates: Partial<DelegatingPathProviderInput> = {
  'openapi/type': delegate('types'),
  'openapi/type-guard': delegate('typeGuards'),
  'openapi/type-validator': delegate('typeValidators'),
}

const clientDelegates: Partial<DelegatingPathProviderInput> = ((): Partial<DelegatingPathProviderInput> => {
  const sdk = delegate('sdk')
  const operations = (path: string, input: any, name: NameProvider) =>
    resolve(join(path, 'operations', `${name(input, 'openapi/operation')}.ts`))
  return {
    ...commonDelegates,

    'openapi/sdk-type': sdk,
    'openapi/sdk-stub': sdk,
    'openapi/client-sdk': sdk,

    'openapi/operation': operations,
    'openapi/request-type': operations,
    'openapi/response-type': operations,
    'openapi/response-body-validator': operations,
    'openapi/request-headers-type': operations,
    'openapi/request-headers-serializer': operations,
    'openapi/response-headers-type': operations,
    'openapi/response-headers-deserializer': operations,
    'openapi/query-type': operations,
    'openapi/query-serializer': operations,
    'openapi/path-type': operations,
    'openapi/path-serializer': operations,
  }
})()

const serverDelegates: Partial<DelegatingPathProviderInput> = ((): Partial<DelegatingPathProviderInput> => {
  const api = delegate('api')
  const routes = (path: string, input: any, name: NameProvider) =>
    resolve(join(path, 'routes', `${name(input, 'openapi/express-route')}.ts`))

  return {
    ...commonDelegates,
    'openapi/api-type': api,
    'openapi/api-stub': api,
    'openapi/express-route-factory': delegate('routes'),
    'openapi/express-routes-type': delegate('routes'),

    'openapi/request-type': routes,
    'openapi/request-server-type': routes,
    'openapi/request-body-validator': routes,
    'openapi/response-type': routes,
    'openapi/request-headers-type': routes,
    'openapi/request-headers-deserializer': routes,
    'openapi/response-headers-type': routes,
    'openapi/response-headers-serializer': routes,
    'openapi/query-type': routes,
    'openapi/query-deserializer': routes,
    'openapi/path-type': routes,
    'openapi/path-deserializer': routes,
    'openapi/express-route': routes,
  }
})()

const client = (path: string): GeneratorPathProvider => delegating(path, clientDelegates)
const server = (path: string): GeneratorPathProvider => delegating(path, serverDelegates)

export const pathProviders = {
  byName,
  byTarget,
  singleFile,
  client,
  server,
}
