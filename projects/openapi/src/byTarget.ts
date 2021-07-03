import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider, OpenAPIGeneratorTarget } from './typings'

function folderName(target: OpenAPIGeneratorTarget): string {
  switch (target) {
    case 'openapi/type':
      return 'types'
    case 'openapi/type-guard':
      return 'typeGuards'
    case 'openapi/operation':
      return 'operations'
    case 'openapi/query-type':
      return 'queryTypes'
    case 'openapi/headers-type':
      return 'headerTypes'
    case 'openapi/path-type':
      return 'pathTypes'
    case 'openapi/response-type':
      return 'responseTypes'
    case 'openapi/input-type':
      return 'inputTypes'
    case 'openapi/path-serializer':
      return 'pathSerializers'
    case 'openapi/query-serializer':
      return 'querySerializers'
    case 'openapi/headers-serializer':
      return 'headerSerializers'
    case 'openapi/expectations':
      return 'expectations'
    case 'openapi/validator':
      return 'validators'
    case 'openapi/api-type':
    case 'openapi/api-class':
    case 'openapi/api-stub':
      return 'api'
  }
}

export function byTarget(path: string, folder: (target: string) => string = folderName): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, folder(target), `${name(input, target)}.ts`))
}
