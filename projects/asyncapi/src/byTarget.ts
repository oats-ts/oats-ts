import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { NameByTarget, AsyncAPIGeneratorTarget } from './typings'

const defaultName: NameByTarget = {
  'asyncapi/type': 'types',
  'asyncapi/type-guard': 'typeGuards',
  'asyncapi/channel': 'channels',
  'asyncapi/publish-type': 'pubTypes',
  'asyncapi/subscribe-type': 'subTypes',
  'asyncapi/query-type': 'queryTypes',
  'asyncapi/path-type': 'pathTypes',
  'asyncapi/path-serializer': 'pathSerializers',
  'asyncapi/query-serializer': 'querySerializers',
  'asyncapi/validator': 'validators',
  'asyncapi/api-type': 'apiType',
  'asyncapi/api-stub': 'apiStub',
  'asyncapi/api-class': 'apiClass',
}

export function byTarget(path: string, nameByTarget: Partial<NameByTarget> = {}): GeneratorPathProvider {
  const mergedNameByTarget: NameByTarget = { ...defaultName, ...nameByTarget }
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, `${mergedNameByTarget[target as AsyncAPIGeneratorTarget]}.ts`))
}
