import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, AsyncAPIGeneratorTarget } from './typings'

const defaultName: NameByTarget = {
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
  'asyncapi/api-type': 'apiType',
  'asyncapi/api-stub': 'apiStub',
  'asyncapi/api-class': 'apiClass',
}

export function byTarget(path: string, nameByTarget: Partial<NameByTarget> = {}): GeneratorPathProvider {
  const mergedNameByTarget: NameByTarget = { ...defaultName, ...nameByTarget }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, `${mergedNameByTarget[target as AsyncAPIGeneratorTarget]}.ts`))
}
