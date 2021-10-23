import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget } from './typings'

export function defaultPathProvider(path: string): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: OpenAPIGeneratorTarget): string => {
    switch (target) {
      case 'openapi/api-type':
      case 'openapi/api-stub':
        return resolve(join(path, 'api', `${name(input, target)}.ts`))
      case 'openapi/express-route':
      case 'openapi/request-body-expectations':
      case 'openapi/request-server-type':
        return resolve(join(path, 'routes', `${name(input, target)}.ts`))
      case 'openapi/sdk-type':
      case 'openapi/sdk-stub':
      case 'openapi/client-sdk':
        return resolve(join(path, 'sdk', `${name(input, target)}.ts`))
      case 'openapi/sdk-type':
        return resolve(join(path, 'sdk', `${name(input, target)}.ts`))
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
      case 'openapi/request-headers-type':
      case 'openapi/request-headers-serializer':
      case 'openapi/request-headers-deserializer':
      case 'openapi/response-headers-serializer':
      case 'openapi/response-headers-deserializer':
      case 'openapi/query-type':
      case 'openapi/query-serializer':
      case 'openapi/query-deserializer':
      case 'openapi/path-type':
      case 'openapi/path-serializer':
      case 'openapi/path-deserializer':
      case 'openapi/response-headers-type':
        return resolve(join(path, 'operations', `${name(input, 'openapi/operation')}.ts`))
    }
  }
}
