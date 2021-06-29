import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider, OpenAPIGeneratorTarget } from './typings'

function folderName(target: OpenAPIGeneratorTarget): string {
  switch (target) {
    case 'type':
      return 'types'
    case 'type-guard':
      return 'typeGuards'
    case 'operation':
      return 'operations'
    case 'operation-query-type':
      return 'queryParameterTypes'
    case 'operation-headers-type':
      return 'headerParameterTypes'
    case 'operation-path-type':
      return 'pathParameterTypes'
    case 'operation-response-type':
      return 'responseTypes'
    case 'operation-input-type':
      return 'inputTypes'
    case 'operation-path-serializer':
      return 'pathSerializers'
    case 'operation-query-serializer':
      return 'querySerializers'
    case 'operation-headers-serializer':
      return 'headerSerializers'
    case 'operation-response-parser-hint':
      return 'parserHints'
    case 'validator':
      return 'validators'
    case 'api-type':
    case 'api-class':
    case 'api-stub':
      return 'api'
  }
}

export function byTarget(path: string, folder: (target: string) => string = folderName): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string) =>
    resolve(join(path, folder(target), `${name(input, target)}.ts`))
}
