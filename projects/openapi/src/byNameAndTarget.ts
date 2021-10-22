import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, OpenAPIGeneratorTarget } from './typings'

const defaultFolderName: NameByTarget = {
  'openapi/type': 'types',
  'openapi/type-guard': 'typeGuards',
  'openapi/operation': 'operations',
  'openapi/query-type': 'queryTypes',
  'openapi/request-headers-type': 'requestHeaderTypes',
  'openapi/path-type': 'pathTypes',
  'openapi/response-headers-type': '',
  'openapi/response-type': 'responseTypes',
  'openapi/request-type': 'requestTypes',
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
  'openapi/sdk-type': 'sdk',
  'openapi/sdk-stub': 'sdk',
  'openapi/client-sdk': 'sdk',
  'openapi/api-type': 'api',
  'openapi/api-stub': 'api',
  'openapi/express-route': 'routes',
  'openapi/request-body-expectations': 'requestBodyExpectations',
}

export function byNameAndTarget(
  path: string,
  folder: Partial<NameByTarget> = defaultFolderName,
): GeneratorPathProvider {
  const mergedFolder: NameByTarget = { ...defaultFolderName, ...folder }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, mergedFolder[target as OpenAPIGeneratorTarget], `${name(input, target)}.ts`))
}
