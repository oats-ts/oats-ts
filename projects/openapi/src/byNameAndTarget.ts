import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, OpenAPIGeneratorTarget } from './typings'

const defaultFolderName: NameByTarget = {
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
  'openapi/sdk-type': 'sdk',
  'openapi/sdk-stub': 'sdk',
  'openapi/client-sdk': 'sdk',
  'openapi/api-type': 'api',
  'openapi/api-stub': 'api',
  'openapi/request-handler-type': 'requestHandlers',
  'openapi/request-listener': 'requestListener',
  'openapi/request-matcher': 'requestMatchers',
}

export function byNameAndTarget(
  path: string,
  folder: Partial<NameByTarget> = defaultFolderName,
): GeneratorPathProvider {
  const mergedFolder: NameByTarget = { ...defaultFolderName, ...folder }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, mergedFolder[target as OpenAPIGeneratorTarget], `${name(input, target)}.ts`))
}
