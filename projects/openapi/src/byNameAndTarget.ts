import { join, resolve } from 'path'
import { GeneratorPathProvider, NameByTarget, NameProvider, OpenAPIGeneratorTarget } from './typings'

const defaultFolderName: NameByTarget = {
  'openapi/type': 'types',
  'openapi/type-guard': 'typeGuards',
  'openapi/operation': 'operations',
  'openapi/query-type': 'queryTypes',
  'openapi/headers-type': 'headerTypes',
  'openapi/path-type': 'pathTypes',
  'openapi/response-type': 'responseTypes',
  'openapi/input-type': 'inputTypes',
  'openapi/path-serializer': 'pathSerializers',
  'openapi/query-serializer': 'querySerializers',
  'openapi/headers-serializer': 'headerSerializers',
  'openapi/expectations': 'expectations',
  'openapi/validator': 'validators',
  'openapi/api-type': 'api',
  'openapi/api-stub': 'api',
  'openapi/api-class': 'api',
}

export function byNameAndTarget(
  path: string,
  folder: Partial<NameByTarget> = defaultFolderName,
): GeneratorPathProvider {
  const mergedFolder: NameByTarget = { ...defaultFolderName, ...folder }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, mergedFolder[target as OpenAPIGeneratorTarget], `${name(input, target)}.ts`))
}
