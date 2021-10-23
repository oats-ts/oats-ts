import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, OpenAPIGeneratorTarget } from './typings'

const defaultName: NameByTarget = {
  'openapi/type': 'types',
  'openapi/type-guard': 'typeGuards',
  'openapi/operation': 'operations',
  'openapi/query-type': 'queryTypes',
  'openapi/request-headers-type': 'requestHeaderTypes',
  'openapi/path-type': 'pathTypes',
  'openapi/response-headers-type': '',
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
  'openapi/expectations': 'expectations',
  'openapi/validator': 'validators',
  'openapi/sdk-type': 'sdkType',
  'openapi/sdk-stub': 'sdkStub',
  'openapi/client-sdk': 'clientSdk',
  'openapi/api-type': 'apiType',
  'openapi/api-stub': 'apiStub',
  'openapi/express-route': 'routes',
  'openapi/request-body-expectations': 'requestBodyExpectations',
}

export function byTarget(path: string, nameByTarget: Partial<NameByTarget> = {}): GeneratorPathProvider {
  const mergedNameByTarget: NameByTarget = { ...defaultName, ...nameByTarget }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, `${mergedNameByTarget[target as OpenAPIGeneratorTarget]}.ts`))
}
