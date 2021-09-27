import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget } from './typings'

export function defaultPathProvider(path: string): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: OpenAPIGeneratorTarget): string => {
    switch (target) {
      case 'openapi/api-class':
      case 'openapi/api-stub':
      case 'openapi/api-type':
        return resolve(join(path, 'api', `${name(input, target)}.ts`))
      case 'openapi/type':
        return resolve(join(path, 'types', `${name(input, target)}.ts`))
      case 'openapi/validator':
        return resolve(join(path, 'validators', `${name(input, target)}.ts`))
      case 'openapi/type-guard':
        return resolve(join(path, 'typeGuards', `${name(input, target)}.ts`))
      case 'openapi/operation':
      case 'openapi/request-type':
      case 'openapi/response-type':
      case 'openapi/expectations':
      case 'openapi/headers-type':
      case 'openapi/headers-serializer':
      case 'openapi/query-type':
      case 'openapi/query-serializer':
      case 'openapi/path-type':
      case 'openapi/path-serializer':
        return resolve(join(path, 'operations', `${name(input, 'openapi/operation')}.ts`))
    }
  }
}
