import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, OpenAPIGeneratorTarget } from './typings'

const defaultName: NameByTarget = {
  'openapi/type': 'types',
  'openapi/type-guard': 'typeGuards',
  'openapi/operation': 'operations',
  'openapi/query-type': 'queryTypes',
  'openapi/headers-type': 'headerTypes',
  'openapi/path-type': 'pathTypes',
  'openapi/response-headers-type': '',
  'openapi/response-type': 'responseTypes',
  'openapi/request-type': 'requestTypes',
  'openapi/path-serializer': 'pathSerializers',
  'openapi/query-serializer': 'querySerializers',
  'openapi/headers-serializer': 'headerSerializers',
  'openapi/path-deserializer': 'pathDeserializers',
  'openapi/query-deserializer': 'queryDeserializers',
  'openapi/headers-deserializer': 'headerDeserializers',
  'openapi/expectations': 'expectations',
  'openapi/validator': 'validators',
  'openapi/sdk-type': 'sdkType',
  'openapi/sdk-stub': 'sdkStub',
  'openapi/client-sdk': 'clientSdk',
  'openapi/api-type': 'apiType',
  'openapi/api-stub': 'apiStub',
  'openapi/request-handler-type': 'requestHandlers',
  'openapi/request-listener': 'requestListener',
  'openapi/request-matcher': 'requestMatchers',
}

export function byTarget(path: string, nameByTarget: Partial<NameByTarget> = {}): GeneratorPathProvider {
  const mergedNameByTarget: NameByTarget = { ...defaultName, ...nameByTarget }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, `${mergedNameByTarget[target as OpenAPIGeneratorTarget]}.ts`))
}
