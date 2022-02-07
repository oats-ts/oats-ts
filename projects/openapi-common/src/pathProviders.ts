import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { isNil } from 'lodash'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget, NameByTarget, DelegatingPathProviderInput, PathDelegate } from './typings'

const nameByTarget: NameByTarget = {
  'json-schema/type': 'types',
  'json-schema/type-guard': 'typeGuards',
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
  'json-schema/type-validator': 'typeValidators',
  'openapi/request-body-validator': 'requestBodyValidators',
  'openapi/response-body-validator': 'responseBodyValidators',
  'openapi/express-route': 'routes',
  'openapi/express-routes-type': 'routes',
  'openapi/express-route-factory': 'routes',
  'openapi/express-cors-middleware': 'routes',
  'openapi/api-type': 'api',
  'openapi/sdk-impl': 'sdk',
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

function delegating(path: string, delegates: DelegatingPathProviderInput): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string): string => {
    const delegate = delegates[target as OpenAPIGeneratorTarget]
    return delegate(path, input, name, target)
  }
}

const delegate =
  (folder: string): PathDelegate =>
  (path: string, input: any, name: NameProvider, target: string) =>
    resolve(join(...[path, ...(isNil(folder) ? [] : [folder]), `${name(input, target)}.ts`]))

const fullStackDelegate: DelegatingPathProviderInput = ((): DelegatingPathProviderInput => {
  const api = delegate('api')
  const sdk = delegate('sdk')
  const types = delegate('types')
  const routers = delegate('routers')
  const parameters = delegate('parameters')
  const serializers = delegate('serializers')
  const deserializers = delegate('deserializers')
  const validators = delegate('validators')
  const responses = delegate('responses')
  const requests = delegate('requests')
  const typeGuards = delegate('typeGuards')
  const operations = delegate('operations')

  return {
    'json-schema/type': types,
    'json-schema/type-guard': typeGuards,

    'openapi/response-type': responses,

    'openapi/request-type': requests,
    'openapi/request-server-type': requests,

    'openapi/api-type': api,

    'json-schema/type-validator': validators,
    'openapi/response-body-validator': validators,
    'openapi/request-body-validator': validators,

    'openapi/request-headers-type': parameters,
    'openapi/response-headers-type': parameters,
    'openapi/path-type': parameters,
    'openapi/query-type': parameters,

    'openapi/request-headers-serializer': serializers,
    'openapi/query-serializer': serializers,
    'openapi/path-serializer': serializers,
    'openapi/response-headers-serializer': serializers,

    'openapi/response-headers-deserializer': deserializers,
    'openapi/request-headers-deserializer': deserializers,
    'openapi/query-deserializer': deserializers,
    'openapi/path-deserializer': deserializers,

    'openapi/operation': operations,

    'openapi/express-route': routers,
    'openapi/express-route-factory': routers,
    'openapi/express-routes-type': routers,
    'openapi/express-cors-middleware': routers,

    'openapi/sdk-type': sdk,
    'openapi/sdk-stub': sdk,
    'openapi/sdk-impl': sdk,
  }
})()

const _default = (path: string): GeneratorPathProvider => delegating(path, fullStackDelegate)

export const pathProviders = {
  byName,
  byTarget,
  singleFile,
  default: _default,
}
