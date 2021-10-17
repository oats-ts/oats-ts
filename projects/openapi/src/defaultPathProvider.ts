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
        return resolve(join(path, 'routes', `${name(input, target)}.ts`))
      case 'openapi/sdk-type':
      case 'openapi/sdk-stub':
      case 'openapi/client-sdk':
        return resolve(join(path, 'sdk', `${name(input, target)}.ts`))
      case 'openapi/request-handler-type':
        return resolve(join(path, 'requestHandlers', `${name(input, target)}.ts`))
      case 'openapi/request-listener':
        return resolve(join(path, `${name(input, target)}.ts`))
      case 'openapi/request-matcher':
        return resolve(join(path, 'requestMatchers', `${name(input, target)}.ts`))
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
      case 'openapi/headers-type':
      case 'openapi/headers-serializer':
      case 'openapi/headers-deserializer':
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
