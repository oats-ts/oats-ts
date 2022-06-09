import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'
import { isNil } from 'lodash'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget, NameByTarget, DelegatingPathProviderInput, PathDelegate } from './typings'

const fileNameByTarget: NameByTarget = {
  'json-schema/type': 'types.ts',
  'json-schema/type-guard': 'typeGuards.ts',
  'openapi/operation': 'operations.ts',
  'openapi/query-type': 'queryTypes.ts',
  'openapi/request-headers-type': 'requestHeaderTypes.ts',
  'openapi/path-type': 'pathTypes.ts',
  'openapi/response-headers-type': 'responseHeaderTypes.ts',
  'openapi/response-type': 'responseTypes.ts',
  'openapi/request-type': 'requestTypes.ts',
  'openapi/request-server-type': 'requestServerTypes.ts',
  'openapi/path-serializer': 'pathSerializers.ts',
  'openapi/query-serializer': 'querySerializers.ts',
  'openapi/request-headers-serializer': 'requestHeaderSerializers.ts',
  'openapi/response-headers-serializer': 'responseHeaderSerializers.ts',
  'openapi/path-deserializer': 'pathDeserializers.ts',
  'openapi/query-deserializer': 'queryDeserializers.ts',
  'openapi/request-headers-deserializer': 'requestHeaderDeserializers.ts',
  'openapi/response-headers-deserializer': 'responseHeaderDeserializers.ts',
  'json-schema/type-validator': 'typeValidators.ts',
  'openapi/request-body-validator': 'requestBodyValidators.ts',
  'openapi/response-body-validator': 'responseBodyValidators.ts',
  'openapi/express-route': 'expressRoutes.ts',
  'openapi/express-routes-type': 'expressRoutesType.ts',
  'openapi/express-route-factory': 'expressRouteFactory.ts',
  'openapi/express-cors-middleware': 'expressCorsMiddleware.ts',
  'openapi/api-type': 'apiType.ts',
  'openapi/sdk-impl': 'sdkImpl.ts',
  'openapi/sdk-type': 'sdkType.ts',
}

const delegate =
  (folder: string): PathDelegate =>
  (path: string, input: any, name: NameProvider, target: string) =>
    resolve(join(...[path, ...(isNil(folder) ? [] : [folder]), `${name(input, target)}.ts`]))

const fullStackDelegate: DelegatingPathProviderInput = ((): DelegatingPathProviderInput => {
  const api = delegate('api')
  const sdk = delegate('sdk')
  const types = delegate('types')
  const routers = delegate('routers')
  const parameters = delegate('parameters')
  const serializers = delegate('serializers')
  const deserializers = delegate('deserializers')
  const validators = delegate('validators')
  const responses = delegate('responses')
  const requests = delegate('requests')
  const typeGuards = delegate('typeGuards')
  const operations = delegate('operations')

  return {
    'json-schema/type': types,
    'json-schema/type-guard': typeGuards,

    'openapi/response-type': responses,

    'openapi/request-type': requests,
    'openapi/request-server-type': requests,

    'openapi/api-type': api,

    'json-schema/type-validator': validators,
    'openapi/response-body-validator': validators,
    'openapi/request-body-validator': validators,

    'openapi/request-headers-type': parameters,
    'openapi/response-headers-type': parameters,
    'openapi/path-type': parameters,
    'openapi/query-type': parameters,

    'openapi/request-headers-serializer': serializers,
    'openapi/query-serializer': serializers,
    'openapi/path-serializer': serializers,
    'openapi/response-headers-serializer': serializers,

    'openapi/response-headers-deserializer': deserializers,
    'openapi/request-headers-deserializer': deserializers,
    'openapi/query-deserializer': deserializers,
    'openapi/path-deserializer': deserializers,

    'openapi/operation': operations,

    'openapi/express-route': routers,
    'openapi/express-route-factory': routers,
    'openapi/express-routes-type': routers,
    'openapi/express-cors-middleware': routers,

    'openapi/sdk-type': sdk,
    'openapi/sdk-impl': sdk,
  }
})()

export const pathProviders = {
  /**
   * Creates a path provider that provides the same fileName every input.
   * @param fileName The name of the file.
   * @returns The path provider
   */
  singleFile(fileName: string): GeneratorPathProvider {
    return () => resolve(fileName)
  },

  /**
   * Creates a path provider that separates output by generator target.
   * @param folder The root folder.
   * @param fileNames (optional) An object, mapping from generator target => file name. You can overwrite default file names with this parameter.
   * @returns The path provider
   */
  byTarget(folder: string, fileNames: Partial<NameByTarget> = {}): GeneratorPathProvider {
    const mergedFileNames: NameByTarget = { ...fileNameByTarget, ...fileNames }
    return (input: any, name: NameProvider, target: string) =>
      resolve(join(folder, mergedFileNames[target as OpenAPIGeneratorTarget]))
  },
  /**
   * Creates a path provider that generates each artifact into it's own file, in the input folder.
   * @param folder The root folder.
   * @returns The path provider
   */
  byName(folder: string): GeneratorPathProvider {
    return (input: any, name: NameProvider, target: string) => resolve(join(folder, `${name(input, target)}.ts`))
  },
  /**
   * Creates a default, recommended path provider. Splits files into topical hierarchy.
   * @param folder The root folder.
   * @returns The path provider
   */
  default(folder: string): GeneratorPathProvider {
    return pathProviders.delegating(folder, fullStackDelegate)
  },
  /**
   * Creates a path provider, which composes the path from folder + result of the appropriate delegate
   * @param folder The root folder.
   * @param delegates The object mapping from generator target => delegate function
   * @returns The path provider.
   */
  delegating(folder: string, delegates: DelegatingPathProviderInput): GeneratorPathProvider {
    return (input: any, name: NameProvider, target: string): string => {
      const delegate = delegates[target as OpenAPIGeneratorTarget]
      if (isNil(delegate)) {
        throw new TypeError(`No delegate for target "${target}".`)
      }
      const path = delegate(folder, input, name, target)
      if (isNil(path)) {
        throw new TypeError(`Path provider delegate for "${target}" returned ${path} for ${JSON.stringify(input)}.`)
      }
      return path
    }
  },
}
