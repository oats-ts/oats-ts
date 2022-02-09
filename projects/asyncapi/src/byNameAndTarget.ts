import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, AsyncAPIGeneratorTarget } from './typings'

const defaultFolderName: NameByTarget = {
  'json-schema/type': 'types',
  'json-schema/type-guard': 'typeGuards',
  'asyncapi/channel': 'channels',
  'asyncapi/channel-factory': 'channelFactories',
  'asyncapi/publish-type': 'pubTypes',
  'asyncapi/subscribe-type': 'subTypes',
  'asyncapi/input-type': 'inputTypes',
  'asyncapi/query-type': 'queryTypes',
  'asyncapi/path-type': 'pathTypes',
  'asyncapi/path-serializer': 'pathSerializers',
  'json-schema/type-validator': 'validators',
  'asyncapi/api-type': 'api',
  'asyncapi/api-stub': 'api',
  'asyncapi/api-class': 'api',
}

export function byNameAndTarget(
  path: string,
  folder: Partial<NameByTarget> = defaultFolderName,
): GeneratorPathProvider {
  const mergedFolder: NameByTarget = { ...defaultFolderName, ...folder }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, mergedFolder[target as AsyncAPIGeneratorTarget], `${name(input, target)}.ts`))
}
